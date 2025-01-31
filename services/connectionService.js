const scanner = require('node-wifi-scanner-fork');
const { exec } = require("child_process");
const dns = require('dns')

class connectionService {

    constructor() {
        this.online = false
        this.checkOnline()
    }

    checkOnline = async () => {
        setTimeout(this.checkOnline, 10 * 1000)
        dns.resolve('google.com',  (err) => {
            if (err) {
                this.online = false
            } else {
                this.online = true
            }
        });
    }

    isOnline() {
        return this.online
    }

    async scan() {
        return new Promise((resolve, reject)=>{
            scanner.scan((err, networks) => {
                if (err) {
                    console.error(err);
                    return resolve([])
                }
                networks = networks.filter(e=>e.ssid.length>0)
                networks = networks.sort((a,b)=>(b.rssi - a.rssi))
                console.log(networks)
                return resolve(networks)
            })
        })
    }

    async exec(command) {
        return new Promise((resolve, reject)=>{
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return resolve('');
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return resolve('');
                }
                console.log(`stdout: ${stdout}`);
                return resolve(stdout);
            });
        })
    }

}

module.exports = connectionService
