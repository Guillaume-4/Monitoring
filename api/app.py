from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import signal
import psutil

app = Flask(__name__)
CORS(app) 

@app.route('/api/stats')
def stats():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    stats = {
        'cpu': cpu_percent,
        'memory': memory.percent,
        'disk': disk.percent
    }
    return jsonify(stats)

# Démarrer un processus
@app.route('/process/start', methods=['POST'])
def start_process():
    data = request.json
    command = data.get('command')
    if not command:
        return jsonify({"success": False, "error": "Command is required"}), 400

    try:
        process = subprocess.Popen(command, shell=True)
        return jsonify({"success": True, "pid": process.pid})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Arrêter un processus
@app.route('/process/stop', methods=['POST'])
def stop_process():
    data = request.json
    pid = data.get('pid')
    if not pid:
        return jsonify({"success": False, "error": "PID is required"}), 400

    try:
        os.kill(int(pid), signal.SIGTERM)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Redémarrer un processus
@app.route('/process/restart', methods=['POST'])
def restart_process():
    data = request.json
    pid = data.get('pid')
    command = data.get('command')
    if not pid or not command:
        return jsonify({"success": False, "error": "PID and Command are required"}), 400

    try:
        os.kill(int(pid), signal.SIGTERM)
        process = subprocess.Popen(command, shell=True)
        return jsonify({"success": True, "new_pid": process.pid})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
