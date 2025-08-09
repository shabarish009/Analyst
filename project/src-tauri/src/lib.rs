use std::{path::PathBuf, process::Command, sync::Mutex};
use once_cell::sync::Lazy;
use rusqlite::{Connection};
use serde_json::{json, Value};

static DB: Lazy<Mutex<Option<Connection>>> = Lazy::new(|| Mutex::new(None));

fn connect_db_file_sync(path: &str) -> Result<(), String> {
  let conn = Connection::open(path).map_err(|e| e.to_string())?;
  let mut guard = DB.lock().map_err(|e| e.to_string())?;
  *guard = Some(conn);
  Ok(())
}

fn execute_query_sync(sql: &str) -> Result<String, String> {
  let mut guard = DB.lock().map_err(|e| e.to_string())?;
  let conn = guard.as_mut().ok_or_else(|| "not connected".to_string())?;
  let sql_trim = sql.trim_start().to_lowercase();
  if sql_trim.starts_with("select") || sql_trim.starts_with("with") {
    let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
    let col_names: Vec<String> = stmt.column_names().into_iter().map(|s| s.to_string()).collect();
    let rows_iter = stmt.query_map([], |row| {
      use rusqlite::types::ValueRef;
      let mut arr: Vec<Value> = Vec::with_capacity(col_names.len());
      for i in 0..col_names.len() {
        let v = row.get_ref(i)?;
        let jv = match v {
          ValueRef::Null => Value::Null,
          ValueRef::Integer(x) => json!(x),
          ValueRef::Real(x) => json!(x),
          ValueRef::Text(x) => json!(String::from_utf8_lossy(x)),
          ValueRef::Blob(_) => json!("<blob>"),
        };
        arr.push(jv);
      }
      Ok(arr)
    }).map_err(|e| e.to_string())?;
    let mut rows: Vec<Value> = Vec::new();
    for r in rows_iter { rows.push(Value::Array(r.map_err(|e| e.to_string())?)); }
    Ok(json!({"cols": col_names, "rows": rows}).to_string())
  } else {
    let affected = conn.execute(sql, []).map_err(|e| e.to_string())?;
    Ok(json!({"affected": affected}).to_string())
  }
}

fn get_schema_sync() -> Result<String, String> {
  let guard = DB.lock().map_err(|e| e.to_string())?;
  let conn = guard.as_ref().ok_or_else(|| "not connected".to_string())?;
  let mut tables_stmt = conn.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").map_err(|e| e.to_string())?;
  let table_names = tables_stmt.query_map([], |row| row.get::<_, String>(0)).map_err(|e| e.to_string())?;
  let mut schema = serde_json::Map::new();
  for t in table_names { let t = t.map_err(|e| e.to_string())?; let cols = get_table_columns(conn, &t)?; schema.insert(t, json!(cols)); }
  Ok(Value::Object(schema).to_string())
}

fn get_table_columns(conn: &Connection, table: &str) -> Result<Vec<String>, String> {
  let q = format!("PRAGMA table_info({});", table);
  let mut stmt = conn.prepare(&q).map_err(|e| e.to_string())?;
  let iter = stmt.query_map([], |row| row.get::<_, String>(1)).map_err(|e| e.to_string())?;
  let mut cols = Vec::new();
  for c in iter { cols.push(c.map_err(|e| e.to_string())?); }
  Ok(cols)
}

fn find_python_and_paths() -> (PathBuf, PathBuf, PathBuf) {
  // return (python_exe, hello_script, gen_script)
  let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
  let root = cwd.join("..").join("..");
  let hello = root.join("ai_core").join("hello.py");
  let gen = root.join("ai_core").join("bridge_generate_sql.py");
  let candidates = [
    root.join("ai_core").join(".venv").join("Scripts").join("python.exe"),
    root.join(".venv").join("Scripts").join("python.exe"),
    PathBuf::from("python"),
  ];
  let py = candidates
    .into_iter()
    .find(|p| p.exists())
    .unwrap_or_else(|| PathBuf::from("python"));
  (py, hello, gen)
}

pub fn run_python_hello_sync() -> Result<String, String> {
  let (py, hello, _) = find_python_and_paths();
  if !hello.exists() {
    return Err(format!("script not found: {}", hello.display()));
  }
  let output = Command::new(py).arg(hello).output().map_err(|e| e.to_string())?;
  if !output.status.success() {
    return Err(format!("python exited with {}", output.status));
  }
  let s = String::from_utf8_lossy(&output.stdout).trim().to_string();
  Ok(s)
}

pub fn run_generate_sql_sync(prompt: &str, schema_json: Option<&str>) -> Result<String, String> {
  let (py, _, gen) = find_python_and_paths();
  if !gen.exists() {
    return Err(format!("script not found: {}", gen.display()));
  }
  let mut cmd = Command::new(py);
  cmd.arg(gen).arg(prompt);
  if let Some(s) = schema_json { cmd.arg(s); }
  let output = cmd.output().map_err(|e| e.to_string())?;
  if !output.status.success() { return Err(format!("python exited with {}", output.status)); }
  let s = String::from_utf8_lossy(&output.stdout).trim().to_string();
  Ok(s)
}

#[tauri::command]
async fn py_hello() -> Result<String, String> { run_python_hello_sync() }

#[tauri::command]
async fn generate_sql(prompt: String, schema: Option<String>) -> Result<String, String> {
  run_generate_sql_sync(&prompt, schema.as_deref())
}

#[tauri::command]
async fn connect_db(path: String) -> Result<(), String> { connect_db_file_sync(&path) }

#[tauri::command]
async fn execute_query(sql: String) -> Result<String, String> { execute_query_sync(&sql) }

#[tauri::command]
async fn get_schema() -> Result<String, String> { get_schema_sync() }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![py_hello, generate_sql, connect_db, execute_query, get_schema])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::*;
  use serde_json::Value;

  #[test]
  fn python_hello_returns_message() {
    let out = run_python_hello_sync().expect("python hello should run");
    assert!(out.to_lowercase().contains("hello"));
  }

  #[test]
  fn generate_sql_returns_json_with_sql() {
    let out = run_generate_sql_sync("prompt", None).expect("generate should run");
    let v: Value = serde_json::from_str(&out).expect("json parse");
    assert!(v.get("sql").and_then(|x| x.as_str()).is_some());
  }

  #[test]
  fn connect_and_execute_select_works() {
    use tempfile::NamedTempFile;
    let f = NamedTempFile::new().expect("tmp");
    let p = f.path().to_string_lossy().to_string();
    connect_db_file_sync(&p).expect("connect");
    execute_query_sync("CREATE TABLE t(id INTEGER);").expect("create");
    execute_query_sync("INSERT INTO t(id) VALUES (1),(2);").expect("insert");
    let out = execute_query_sync("SELECT id FROM t ORDER BY id;").expect("select");
    let v: Value = serde_json::from_str(&out).expect("json parse");
    let rows = v.get("rows").and_then(|x| x.as_array()).unwrap();
    assert_eq!(rows.len(), 2);
  }
}
