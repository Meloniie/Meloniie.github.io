function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var Items = {
    Ores: {
        Iron: 0
    },
    Ingots: {
        Iron: 0
    },
    Fuel: {
        Coal: 0
    }
}

class Module {
    constructor(cost, level, costType, name, upgrade) {
        this.cost = cost
        this.level = level
        this.name = name
        this.costType = costType
        this.upgrade = upgrade
        this.Buy = function() {
            if (this.costType == "Iron Ingots") {
                if (Items.Ingots.Iron >= this.cost) {
                    Items.Ingots.Iron -= this.cost
                    this.upgrade()
                }
            } else if (this.costType == "Iron Ores") {
                if (Items.Ores.Iron >= this.cost) {
                    Items.Ores.Iron -= this.cost
                    this.upgrade()
                }
            }
        }
    }
}

var mineTime = 500
var smeltTime = 1000
var fuelUsage = 5

var smelting = false

const mineSpeed = new Module(3, 0, "Iron Ores", "Mining Speed +", function() {
    mineTime -= 30
    mineSpeed.cost = Math.ceil(mineSpeed.cost *= 2)
    mineSpeed.level += 1
    if (mineSpeed.level == 5) {
        mineSpeed.Buy = function() {
            return;
        }
        mineSpeed.name = "Mining Speed + (MAXED)"
        mineSpeed.cost = ""
        mineSpeed.costType = ""
    }
})

const smeltSpeed = new Module(2, 0, "Iron Ingots", "Smelting Speed +", function() {
    smeltTime -= 60
    smeltSpeed.cost = Math.ceil(smeltSpeed.cost *= 2)
    smeltSpeed.level += 1
    if (smeltSpeed.level == 5) {
        smeltSpeed.Buy = function() {
            return;
        }
        smeltSpeed.name = "Smelting Speed + (MAXED)"
        smeltSpeed.cost = ""
        smeltSpeed.costType = ""
    }
})

const fuelUsageUpgrade = new Module(3, 0, "Iron Ingots", "Fuel Usage (Smelting) -", function() {
    fuelUsage--
    fuelUsage.cost = Math.ceil(fuelUsage.cost *= 3)
    fuelUsageUpgrade.level += 1
    document.getElementById("smeltOre").innerHTML = `Smelt Iron Ore (${fuelUsage} Coal)`
    if (fuenUsageUpgrade.level == 4) {
        fuenUsageUpgrade.Buy = function() {
            return;
        }
        fuenUsageUpgrade.name = "Fuel Usage (Smelting) - (MAXED)"
        fuenUsageUpgrade.cost = ""
        fuenUsageUpgrade.costType = ""
    }
})

async function mineOre() {
    document.getElementById("mineOre").disabled = true
    document.getElementById("mineCoal").disabled = true
    document.getElementById("mineOre").innerHTML = `Initiating Mining...`
    await sleep(mineTime / 2)
    var countdown = mineTime/1000
    for (var i = 0; i<mineTime/10 + 1; i++) {
        await sleep(10)
        document.getElementById("mineOre").innerHTML = `Mining... (${Math.floor(countdown * 100) / 100}s)`
        countdown -= 0.01
    }
    Items.Ores.Iron++
    document.getElementById("mineOre").disabled = false
    document.getElementById("mineCoal").disabled = false
    document.getElementById("mineOre").innerHTML = `Mine Iron Ore`
}

async function mineCoal() {
    document.getElementById("mineOre").disabled = true
    document.getElementById("mineCoal").disabled = true
    document.getElementById("mineCoal").innerHTML = `Initiating Mining...`
    await sleep(mineTime / 2)
    var countdown = mineTime/2000
    for (var i = 0; i<mineTime/20 + 1; i++) {
        await sleep(10)
        document.getElementById("mineCoal").innerHTML = `Mining... (${Math.floor(countdown * 100) / 100}s)`
        countdown -= 0.01
    }
    Items.Fuel.Coal++
    document.getElementById("mineOre").disabled = false
    document.getElementById("mineCoal").disabled = false
    document.getElementById("mineCoal").innerHTML = `Mine Coal`
}

async function smeltOre() {
    Items.Ores.Iron--
    Items.Fuel.Coal -= fuelUsage
    smelting = true
    var countdown = smeltTime/1000
    document.getElementById("smeltOre").innerHTML = `Initiating Smelting...`
    await sleep(smeltTime / 2)
    for (var i = 0; i<smeltTime/10 + 1; i++) {
        await sleep(10)
        document.getElementById("smeltOre").innerHTML = `Smelting... (${Math.floor(countdown * 100) / 100}s)`
        countdown -= 0.01
    }
    Items.Ingots.Iron++
    smelting = false
    document.getElementById("smeltOre").innerHTML = `Smelt Iron Ore (${fuelUsage} Coal)`
}

window.setInterval(function() {
    document.getElementById("ironOre").innerHTML = `${toExponential(Items.Ores.Iron)} Iron Ore`
    document.getElementById("coal").innerHTML = `${toExponential(Items.Fuel.Coal)} Coal`
    document.getElementById("ironIngots").innerHTML = `${toExponential(Items.Ingots.Iron)} Iron Ingots`
    document.getElementById("mineSpdText").innerHTML = mineSpeed.name
    document.getElementById("mineSpdCost").innerHTML = toExponential(mineSpeed.cost + ' ' + mineSpeed.costType)
    document.getElementById("smeltSpdText").innerHTML = smeltSpeed.name
    document.getElementById("smeltSpdCost").innerHTML = toExponential(smeltSpeed.cost + ' ' + smeltSpeed.costType)
    document.getElementById("FusageText").innerHTML = fuelUsageUpgrade.name
    document.getElementById("FusageCost").innerHTML = toExponential(fuelUsageUpgrade.cost + ' ' + fuelUsageUpgrade.costType)
    if (Items.Ores.Iron > 0 && Items.Fuel.Coal >= fuelUsage && smelting == false) {
        document.getElementById("smeltOre").disabled = false
    } else {
        document.getElementById("smeltOre").disabled = true
    }
}, 17)

document.getElementById("smeltOre").innerHTML = `Smelt Iron Ore (${fuelUsage} Coal)`