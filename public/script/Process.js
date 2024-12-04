function startProcess(command) {
    fetch('http://localhost:5000/process/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
    }).then(response => response.json())
      .then(data => alert(data.success ? `Process started! PID: ${data.pid}` : `Error: ${data.error}`));
}

function stopProcess(pid) {
    fetch('http://localhost:5000/process/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid })
    }).then(response => response.json())
      .then(data => alert(data.success ? 'Process stopped!' : `Error: ${data.error}`));
}

function restartProcess(pid, command) {
    fetch('http://localhost:5000/process/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid, command })
    }).then(response => response.json())
      .then(data => alert(data.success ? `Process restarted! New PID: ${data.new_pid}` : `Error: ${data.error}`));
}