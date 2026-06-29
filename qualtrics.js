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


            // 1. Leisure Activity Ratings
            // Pulled in  fixed order as defined in leisure_activities array in MathLeisureChoiceExperiment.js
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


            // 2. Math Activity Ratings
            // Pulled in fixed order as defined in math_assignments array in MathLeisureChoiceExperiment.js
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


            // 3. Top 6 Leisure Activities Ranks (ranked 1st through 6th)
            // Read in participant's top 6 rankings from jsPsych data property written by process_survey_data block in MathLeisureChoiceExperiment.js
            var process_trial = mydata.filter(function(trial) { return trial.top_activities; });
            var top_6 = process_trial.length > 0 ? process_trial[0].top_activities : [];


            // 4. Choice Task Trial-level Data (216 trials)
            var choice_trials = mydata.filter(function(trial) { return trial.phase === '2afc_choice'; });

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

            // What was chosen: 'leisure' or 'math'
            var choice_category = choice_trials.map(function(t) { return t.choice_category; }).toString();

        
            // 5. Summary stats
            var total_trials = choice_trials.length;

            var leisure_choices = choice_trials.filter(function(t) { return t.choice_category === 'leisure'; }).length;
            var math_choices = choice_trials.filter(function(t) { return t.choice_category === 'math'; }).length;

            var proportion_leisure = total_trials > 0 ? (leisure_choices / total_trials).toFixed(4) : '';
            var proportion_math = total_trials > 0 ? (math_choices    / total_trials).toFixed(4) : '';


            // 6. Saving Everything as Qualtrics Embedded Data
            // Survey ratings
            Qualtrics.SurveyEngine.setEmbeddedData('leisure_ratings', leisure_ratings);
            Qualtrics.SurveyEngine.setEmbeddedData('math_ratings', math_ratings);

            // Top 6 leisure activities (separate variables, ranked 1st to 6th)
            top_6.forEach(function(activity, i) {
                Qualtrics.SurveyEngine.setEmbeddedData('top_leisure_' + (i + 1), activity);
            });

            // Trial-level choice task data
            Qualtrics.SurveyEngine.setEmbeddedData('leisure_option', leisure_option);
            Qualtrics.SurveyEngine.setEmbeddedData('leisure_side', leisure_side);
            Qualtrics.SurveyEngine.setEmbeddedData('math_option', math_option);
            Qualtrics.SurveyEngine.setEmbeddedData('math_side', math_side);
            Qualtrics.SurveyEngine.setEmbeddedData('math_weight', math_weight);
            Qualtrics.SurveyEngine.setEmbeddedData('math_deadline', math_deadline);
            Qualtrics.SurveyEngine.setEmbeddedData('rt', rt);
            Qualtrics.SurveyEngine.setEmbeddedData('choice_category', choice_category);

            // Summary statistics
            Qualtrics.SurveyEngine.setEmbeddedData('total_trials', total_trials);
            Qualtrics.SurveyEngine.setEmbeddedData('leisure_choices', leisure_choices);
            Qualtrics.SurveyEngine.setEmbeddedData('proportion_leisure', proportion_leisure);
            Qualtrics.SurveyEngine.setEmbeddedData('math_choices', math_choices);
            Qualtrics.SurveyEngine.setEmbeddedData('proportion_math', proportion_math);

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