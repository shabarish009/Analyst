use std::{fs, path::PathBuf, process::Command};

fn find_python() -> (PathBuf, PathBuf) {
  // return (python_exe, script_path)
  let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
  // For crate at project/src-tauri, repo root is two levels up
  let root = cwd.join("..").join("..");
  let script = root.join("ai_core").join("hello.py");
  let candidates = [
    root.join("ai_core").join(".venv").join("Scripts").join("python.exe"),
    root.join(".venv").join("Scripts").join("python.exe"),
    PathBuf::from("python"),
  ];
  let py = candidates
    .into_iter()
    .find(|p| p.exists())
    .unwrap_or_else(|| PathBuf::from("python"));
  (py, script)
}

pub fn run_python_hello_sync() -> Result<String, String> {
  let (py, script) = find_python();
  if !script.exists() {
    return Err(format!("script not found: {}", script.display()));
  }
  let output = Command::new(py)
    .arg(script)
    .output()
    .map_err(|e| e.to_string())?;
  if !output.status.success() {
    return Err(format!("python exited with {}", output.status));
  }
  let s = String::from_utf8_lossy(&output.stdout).trim().to_string();
  Ok(s)
}

#[tauri::command]
async fn py_hello() -> Result<String, String> {
  run_python_hello_sync()
}

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
    .invoke_handler(tauri::generate_handler![py_hello])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::*;
  #[test]
  fn python_hello_returns_message() {
    let out = run_python_hello_sync().expect("python hello should run");
    assert!(out.to_lowercase().contains("hello"));
  }
}
