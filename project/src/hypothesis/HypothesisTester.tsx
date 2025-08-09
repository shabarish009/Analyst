import React, { useState } from 'react'
import { useShellStore } from '../state/store'
import { planHypothesis as planViaBridge } from '../lib/hypoBridge'

export const HypothesisTester: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const setPlanStore = useShellStore((s) => s.setTestPlan)
  const setResultStore = useShellStore((s) => s.setTestResult)
  const plan = useShellStore((s) => s.testPlan)
  const result = useShellStore((s) => s.testResult)

  const onPlan = async () => {
    const j = await planViaBridge(prompt)
    setPlanStore(j?.plan || null)
  }

  const onExecute = async () => {
    // broadcast execution intent via store nonce
    useShellStore.getState().triggerTestPlanExecution()
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label htmlFor="hypo">Hypothesis</label>
      <input id="hypo" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Are signups growing?" />
      <div>
        <button onClick={onPlan} aria-label="Plan Hypothesis">Plan</button>
        <button onClick={onExecute} aria-label="Execute Plan" disabled={!plan}>Execute</button>
      </div>
      {plan && <pre aria-label="Plan" style={{ background: '#f7f7f7', padding: 8 }}>{JSON.stringify(plan, null, 2)}</pre>}
      <div role="status" aria-label="Result">{result?.message || ''}</div>
    </div>
  )
}

