Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/
    var qthis = this;
    qthis.hideNextButton();
	
	var task_github = "https://marbarn98.github.io/MathLeisureChoiceExperiment/"; 

    // the below urls must be accessible with your browser
    // for example, https://marbarn98.github.io/jsPsych/jspsych.js
    var requiredResources = [
		task_github + "jspsych/jspsych.js",
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }
    
    window.addEventListener('message', function(event) {
        if (event.data.event === 'iframecomplete') {
            console.log('message received');
            var mydata = JSON.parse(event.data.data);


            // Leisure activity ratings
            // Pulled in order from leisure_activities array in MathLeisureChoiceExperiment.js
            var leisure_activities_ordered = [
                "Read a book", "Do a puzzle", "Cook your favorite meal", "Exercise", "Scroll on social media",
                "Play your favorite video game", "Hang out with friends", "Grab something to eat", "Watch a show, movie, or video",
                "Go to the movies with friends", "Do some photography", "Go on a hike/walk", "Do yoga", "Weightlift/hit the gym", "Meditation",
                "Take a nap", "Do some journaling", "Go to a concert", "Watch your favorite sport", "Practice a language",
                "Play board games with friends", "Draw", "Knit or crochet something", "Go shopping", "Bake your favorite treat", "Go for a run",
                "Chill out", "Take a pottery class", "Play chess", "Go rock climbing", "Go camping with friends",
                "Build a new Lego set", "Listen to a podcast or audiobook", "Play sports", "Go to a friend's party", "Clean",
                "Organize your room", "Practice an instrument", "Go on a date"
            ];

            var leisure_survey_trial = mydata.filter(function(trial) { return trial.phase === 'survey_rating_leisure'; });
            var leisure_responses = leisure_survey_trial.length > 0 ? leisure_survey_trial[0].response : {};

            var leisure_ratings = leisure_activities_ordered.map(function(activity, index) {
                var key = "leisure_" + index;
                return leisure_responses[key] !== undefined ? leisure_responses[key] : '';
            }).toString();


            // Math activity ratings
            // Pulled in order from math_assignments array in MathLeisureChoiceExperiment.js
            var math_assignments_ordered = [
                "Work on a math assignment",  // index 0
                "Study for a math quiz",      // index 1
                "Study for a math test",      // index 2
                "Study for a major math exam" // index 3
            ];

            var math_survey_trial = mydata.filter(function(trial) { return trial.phase === 'survey_rating_math'; });
            var math_responses = math_survey_trial.length > 0 ? math_survey_trial[0].response : {};

            var math_ratings = math_assignments_ordered.map(function(activity, index) {
                var key = "math_" + index;
                return math_responses[key] !== undefined ? math_responses[key] : '';
            }).toString();


            // Top 6 leisure activities rankings
            // Read in participant's top 6 rankings from jsPsych data property written by process_survey_data block in MathLeisureChoiceExperiment.js
            var process_trial = mydata.filter(function(trial) { return trial.top_activities; });
            var top_6 = process_trial.length > 0 ? process_trial[0].top_activities : [];


            // Choice task trial-level data 
            var choice_trials = mydata.filter(function(trial) { return trial.phase === '2afc_choice'; });

            // Trial index: keep track of what trials done for a) flagging non-completers/technical issues, and b) converting trial data into long data file later
            var trial_index = choice_trials.map(function(t, i) { return i + 1; }).toString();

            // Which leisure activity shown
            var leisure_option = choice_trials.map(function(t) { return t.leisure_option; }).toString();

            // Which side (left=0, right=1) leisure option was shown on
            // button_left_text holds the text of the left button; compare to leisure_option
            var leisure_side = choice_trials.map(function(t) {
                return (t.button_left_text === t.leisure_option) ? 'left' : 'right';
            }).toString();

            // Math activity label (action + type), e.g. "Work on a math assignment"
            var math_option = choice_trials.map(function(t) {
                return t.math_action + ' ' + t.math_type;
            }).toString();

            // Which side math option was shown on (opposite of leisure side)
            var math_side = choice_trials.map(function(t) {
                return (t.button_left_text === t.leisure_option) ? 'right' : 'left';
            }).toString();

            // Grade weight shown
            var math_weight = choice_trials.map(function(t) { return t.math_weight; }).toString();

            // Deadline shown
            var math_deadline = choice_trials.map(function(t) { return t.math_deadline; }).toString();

            // RT per trial (ms)
            var rt = choice_trials.map(function(t) { return t.rt; }).toString();

            // What category was chosen: 'leisure' or 'math'
            var choice_category = choice_trials.map(function(t) { return t.choice_category; }).toString();

        
            // Summary stats
            var total_trials = choice_trials.length;

            var leisure_choices = choice_trials.filter(function(t) { return t.choice_category === 'leisure'; }).length;
            var math_choices = choice_trials.filter(function(t) { return t.choice_category === 'math'; }).length;

            var proportion_leisure = total_trials > 0 ? (leisure_choices / total_trials).toFixed(4) : '';
            var proportion_math = total_trials > 0 ? (math_choices / total_trials).toFixed(4) : '';



            // Calculating deadline sensitivity as a leisure choice difference score: long deadlines vs short

            // First define and record short/long deadline trials
            var short_deadlines = ["4 hours", "12 hours", "1 day"];
            var long_deadlines = ["3 days", "1 week", "1 month"];

            var short_deadline_trials = choice_trials.filter(function(t) {
                return short_deadlines.indexOf(t.math_deadline) !== -1;
            });
            var long_deadline_trials = choice_trials.filter(function(t) {
                return long_deadlines.indexOf(t.math_deadline) !== -1;
            });

            var short_deadline_leisure_choices = short_deadline_trials.filter(function(t) {
                return t.choice_category === 'leisure';
            }).length;
            var long_deadline_leisure_choices = long_deadline_trials.filter(function(t) {
                return t.choice_category === 'leisure';
            }).length;

            var proportion_leisure_short_deadline = short_deadline_trials.length > 0
                ? (short_deadline_leisure_choices / short_deadline_trials.length) : NaN;
            var proportion_leisure_long_deadline = long_deadline_trials.length > 0
                ? (long_deadline_leisure_choices / long_deadline_trials.length) : NaN;

            // Difference score = long-deadline leisure proportion - short
            // Positive score means ptp is more likely to choose leisure activity (i.e., procrastinate) when the deadline is further out
            var procrastination_diff_score = (!isNaN(proportion_leisure_short_deadline) && !isNaN(proportion_leisure_long_deadline))
                ? (proportion_leisure_long_deadline - proportion_leisure_short_deadline).toFixed(4) : '';
            
            
            

            // Saving everything as Qualtrics embedded data
            // Survey ratings
            Qualtrics.SurveyEngine.setJSEmbeddedData('leisure_ratings', leisure_ratings);
            Qualtrics.SurveyEngine.setJSEmbeddedData('math_ratings', math_ratings);

            // Top 6 leisure activities (separate variables, ranked 1st to 6th)
            top_6.forEach(function(activity, i) {
                Qualtrics.SurveyEngine.setJSEmbeddedData('top_leisure_' + (i + 1), activity);
            });

            // Trial-level choice task data
            Qualtrics.SurveyEngine.setJSEmbeddedData('trial_index', trial_index);
            Qualtrics.SurveyEngine.setJSEmbeddedData('leisure_option', leisure_option);
            Qualtrics.SurveyEngine.setJSEmbeddedData('leisure_side', leisure_side);
            Qualtrics.SurveyEngine.setJSEmbeddedData('math_option', math_option);
            Qualtrics.SurveyEngine.setJSEmbeddedData('math_side', math_side);
            Qualtrics.SurveyEngine.setJSEmbeddedData('math_weight', math_weight);
            Qualtrics.SurveyEngine.setJSEmbeddedData('math_deadline', math_deadline);
            Qualtrics.SurveyEngine.setJSEmbeddedData('rt', rt);
            Qualtrics.SurveyEngine.setJSEmbeddedData('choice_category', choice_category);

            // Summary statistics
            Qualtrics.SurveyEngine.setJSEmbeddedData('total_trials', total_trials);
            Qualtrics.SurveyEngine.setJSEmbeddedData('leisure_choices', leisure_choices);
            Qualtrics.SurveyEngine.setJSEmbeddedData('proportion_leisure', proportion_leisure);
            Qualtrics.SurveyEngine.setJSEmbeddedData('math_choices', math_choices);
            Qualtrics.SurveyEngine.setJSEmbeddedData('proportion_math', proportion_math);
            Qualtrics.SurveyEngine.setJSEmbeddedData('proportion_leisure_short_deadline', isNaN(proportion_leisure_short_deadline) ? '' : proportion_leisure_short_deadline.toFixed(4));
            Qualtrics.SurveyEngine.setJSEmbeddedData('proportion_leisure_long_deadline', isNaN(proportion_leisure_long_deadline) ? '' : proportion_leisure_long_deadline.toFixed(4));
            Qualtrics.SurveyEngine.setJSEmbeddedData('procrastination_diff_score', procrastination_diff_score);

            qthis.showNextButton();
            qthis.clickNextButton();
        }
    });

});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});