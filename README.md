statHues
=======

A set of tools (hacked in a day!!) to have [Hue Lamps](http://www.meethue.com/) and a [Raspberry PI](http://www.raspberrypi.org) monitoring your software and infrastructure and KPIs, the Web of Things way!

It currently support Jenkins, Pingdom and Hue out of the box.

# Key Concepts

The code is organized alongside two types of services in their respective folders: outputs and inputs. Inputs are the services you get your data from (e.g., Pingdom), Outputs the real-world services you use to display the status of your system (e.g., Hue lamps).

# Installation & Configuration

* Clone the repository. 
* `npm install`
* Add a `config.json` file to the root directory containing the credentials to access the inputs and outputs

```json

{
"pingdom" : {
    "url" : "",
    "username" : "",
    "password" : "",
    "apiKey" : "",
    "interval" : 30
    },
"hue" : {
    "url" : "",
    "username" : "",
    "password" : "",
    "apiKey" : "",
    "lampServices" : ["jenkins", "jenkinsbuild", "pingdom"]
    },
"jenkins" : {
    "url" : "",
    "username" : "",
    "password" : "",
    "apiKey" : "",
    "interval" : 30
    },
"jenkinsbuild" : {
       "url" : "",
    "username" : "",
    "password" : "",
    "apiKey" : "",
    "interval" : 30,
    "watched" : ["JOB1", "JOB2", ...]
    },
"evrythng" : {
    "url" : "",
    "apiKey" : ""
    }
}
```
# Usage

        $ node statHues.js
        
# Extending statHues
   
This project was hacked in a day by a crew of devs at [EVRYTHNG](http://evrythng.com) during one of our hackatons, it is definitely not mature neither clean but is a start!
    
## Adding Inputs / Outputs

To add an input / output service:

1. Create your `*.js` file in the corresponding directory (`libs/outputs` or `libs/inputs`).
2. Add the configuration for your service in your local `config.json`.
3. Add your new service to the `inputsOutputs` array in `statHues.js` (we should probably remove this step!)


  


