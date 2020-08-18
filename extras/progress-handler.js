var config = {
    /*
        Define the progressbar type
            0 = Single progressbar
            1 = Multiple progressbars
            2 = Collapsed progressbars
     */
    progressBarType: 0,

    /*
        Here you can disable some of progressbars.
        Only applys if `singleProgressbar` is false.
    */
    progressBars:
    {
        "INIT_CORE": {
            enabled: true, //NOTE: Disabled because INIT_CORE seems to not get called properly. (race condition).
        },

        "INIT_BEFORE_MAP_LOADED": {
            enabled: true,
        },

        "MAP": {
            enabled: true,
        },

        "INIT_AFTER_MAP_LOADED": {
            enabled: true,
        },

        "INIT_SESSION": {
            enabled: true,
        }
    },
}

var types = [
    "INIT_CORE",
    "INIT_BEFORE_MAP_LOADED",
    "MAP",
    "INIT_AFTER_MAP_LOADED",
    "INIT_SESSION"
];

var stateCount = 5;
var states = {};

const handlers = 
{
    startInitFunction(data)
    {
        //Create a entry for every type.
        if(states[data.type] == null)
        {
            states[data.type] = {};
            states[data.type].count = 0;
            states[data.type].done = 0;   
            

            //NOTE: We increment the stateCount if we do receive the INIT_CORE.
            //      Because INIT_CORE is the first type, it will not always be invoked due to a race condidition.
            //      See Issue #1 on github.
            if(data.type == types[0])
            {
                stateCount++;
            }
        }
    },

    startInitFunctionOrder(data)
    {
        //Collect the total count for each type.
        if(states[data.type] != null)
        {
            states[data.type].count += data.count;
        }
    },

    initFunctionInvoked(data)
    {
        //Increment the done accumulator based on type.
        if(states[data.type] != null)
        {
            states[data.type].done++;
        }
    },

    startDataFileEntries(data)
    {
        //Manually add the MAP type.
        states["MAP"] = {};
        states["MAP"].count = data.count;
        states["MAP"].done = 0; 
    },

    performMapLoadFunction(data)
    {
        //Increment the map done accumulator.
        states["MAP"].done++;
    }

};

window.addEventListener('message', function(e)
{
    (handlers[e.data.eventName] || function() {})(e.data);
});

//Get the progress of a specific type. (See types array).
function GetTypeProgress(type)
{
    if(states[type] != null)
    {
        var progress = states[type].done / states[type].count;
        return Math.round(progress * 100);
    }

    return 0;
}

//Get the total progress for all the types.
function GetTotalProgress()
{
    var totalProgress = 0;
    var totalStates = 0;
    
    for(var i = 0; i < types.length; i++)
    {
        var key = types[i];
        if(config.progressBars[key].enabled)
        {
            totalProgress += GetTypeProgress(key);
            totalStates++;
        }
    }
    
    //Dont want to divide by zero because it will return NaN.
    //Be nice and return a zero for us.
    if(totalProgress == 0) return 0;
    
    return totalProgress / totalStates;
}



////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

Init();

//Cache to keep track of all progress values.
//This is need for the Math.max functions (so no backwards progressbars).
var progressCache = [];

function Init()
{

    if(config.progressBarType == 0)
    {
        //Start single progressbar.
        var progressBar = document.getElementById("pb0");

        setInterval(UpdateSingle, 250);
    }
} 

//Update the single progressbar.
function UpdateSingle()
{
    UpdateTotalProgress();

    var progressBar = document.getElementById("pb0");
    progressBar.value = progressCache[10];

}

// Update the total percentage loaded (above the progressbar on the right).
function UpdateTotalProgress()
{
        //Set the total progress counter:
        var total = GetTotalProgress();
        var totalProgress = document.getElementById("progress-bar-value");
    
        if(progressCache[10] != null)
        {
            total = Math.max(total, progressCache[10]);
        }
        
        totalProgress.innerHTML = Math.round(total);
        progressCache[10] = total;
}