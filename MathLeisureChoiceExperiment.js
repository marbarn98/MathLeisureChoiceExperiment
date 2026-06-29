/* Remove comment notation below if want to run in browser */
var jsPsych = initJsPsych({
  on_finish: function() {
    // window.parent.postMessage('iframecomplete', '*');
    mydata = jsPsych.data.get().json();
    window.parent.postMessage({event: 'iframecomplete', data: mydata}, '*');
    // jsPsych.data.displayData();
  }
});

/* put html in separate file */

/* experiment parameters */
var top_activities = []; // Will be populated dynamically in the experiment, after the survey
var deadlines = ["4 hours", "12 hours", "1 day", "3 days", "1 week", "1 month"];

var math_assignments = [
  { action: "Work on a", type: "math assignment", weight: ["1%", "12%", "20%"] }, 
  { action: "Study for a", type: "math quiz", weight: "1%" },                         
  { action: "Study for a", type: "math test", weight: "12%" },                  
  { action: "Study for a", type: "major math exam", weight: "20%" }                      
];

// Pool of leisure activities for participants to rate
var leisure_activities = [
  "Read a book", "Do a puzzle", "Cook your favorite meal", "Exercise", "Scroll on social media",
  "Play your favorite video game", "Hang out with friends", "Grab something to eat", "Watch a show, movie, or video", 
  "Go to the movies with friends", "Do some photography", "Go on a hike/walk", "Do yoga", "Weightlift/hit the gym", "Meditation", 
  "Take a nap", "Do some journaling", "Go to a concert", "Watch your favorite sport", "Practice a language", 
  "Play board games with friends", "Draw", "Knit or crochet something", "Go shopping", "Bake your favorite treat", "Go for a run",
  "Chill out", "Take a pottery class", "Play chess", "Go rock climbing", "Go camping with friends", 
  "Build a new Lego set", "Listen to a podcast or audiobook", "Play sports", "Go to a friend's party", "Clean",
  "Organize your room", "Practice an instrument", "Go on a date"
];

/*set up welcome block*/
var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to begin."
};

/*1. set up instructions block*/
var instructions = {
  type: jsPsychHtmlButtonResponse,
  choices: ['OK'],
  stimulus: "<p><b>Instructions:</b> First, you will be asked to rate a series of activities based on how enjoyable or unenjoyable you find them.</p>" +
            "<p>Afterward, you will complete a decision task choosing between these alternatives.</p>" +
            "<p>If you understand these instructions, click <b>OK.</b></p>",
  allow_keys: false,
  show_clickable_nav: true,
  post_trial_gap: 1000
};

/*2. Survey Block - Part 1: Leisure Activities*/
var leisure_survey_page = {
  type: jsPsychSurvey,
  survey_json: function() {
    var elements = leisure_activities.map(function(activity_string, index) {
      return {
        type: "text",
        name: "leisure_" + index,
        title: activity_string,
        inputType: "range",
        min: -5,
        max: 5,
        step: 0.01,
        defaultValue: 0.00,
        minRateDescription: "Unenjoyable (-5)",
        midRateDescription: "Neutral (0)",
        maxRateDescription: "Enjoyable (+5)"
      };
    });

    var shuffled_elements = jsPsych.randomization.shuffle(elements);

    return {
      showQuestionNumbers: "off",
      title: "Part 1: Leisure Activities",
      // Custom structured instructions written specifically for leisure activities
      description: "Instructions: Please rank the following leisure activities and hobbies below, based on how enjoyable or unenjoyable you find them. Some of these activities may not exactly match your preferences, but please try to rate based on how close it is to one of your preferred activities (For example: if you like card games/tabletop games/tile games, then you should rank the <q>Play board games with friends</q> option highly).",
      elements: shuffled_elements
    };
  },
  data: { phase: 'survey_rating_leisure' },
  
  // This step forces participant to move/interact with each slider before they can submit
  on_load: function() {
    // 1. Locate the Survey Complete/Submit button
    var submit_btn = document.querySelector(".sv-btn.sv-footer__complete-btn");
    if (submit_btn) {
      submit_btn.disabled = true; // Lock it initially
      submit_btn.style.opacity = "0.5";
    }

    // 2. Find all range inputs (the sliders) on the page
    var sliders = document.querySelectorAll("input[type='range']");
    var total_sliders = sliders.length;
    var interacted_sliders = new Set(); // Tracks unique sliders moved

    // 3. Attach an input listener to every slider on the screen
    sliders.forEach(function(slider, index) {
      // Add a unique identifier tag to each HTML slider element
      slider.setAttribute("data-slider-idx", index);

      slider.addEventListener("input", function(e) {
        var idx = e.target.getAttribute("data-slider-idx");
        interacted_sliders.add(idx); // Log that this specific slider was adjusted

        // 4. If the user has moved/interacted with all sliders, then unlock the submit button
        if (interacted_sliders.size === total_sliders) {
          if (submit_btn) {
            submit_btn.disabled = false;
            submit_btn.style.opacity = "1";
          }
        }
      });
    });
  }
};

/*3. Survey Block - Part 2: Math Tasks*/
var math_survey_page = {
  type: jsPsychSurvey,
  survey_json: function() {
    var elements = math_assignments.map(function(math, index) {
      return {
        type: "text",
        name: "math_" + index,
        title: `${math.action} ${math.type}`,
        inputType: "range",
        min: -5,
        max: 5,
        step: 0.01,
        defaultValue: 0.00,
        minRateDescription: "Unenjoyable (-5)",
        midRateDescription: "Neutral (0)",
        maxRateDescription: "Enjoyable (+5)"
      };
    });

    var shuffled_elements = jsPsych.randomization.shuffle(elements);

    return {
      showQuestionNumbers: "off",
      title: "Part 2: Math Activities",
      // Custom structured instructions written specifically for math activities
      description: "Instructions: Please rank the following math activities below, based on how enjoyable or unenjoyable you find them.",
      elements: shuffled_elements
    };
  },
  data: { phase: 'survey_rating_math' },
  on_load: function() {
    var submit_btn = document.querySelector(".sv-btn.sv-footer__complete-btn");
    if (submit_btn) {
      submit_btn.disabled = true;
      submit_btn.style.opacity = "0.5";
    }
    var sliders = document.querySelectorAll("input[type='range']");
    var total_sliders = sliders.length;
    var interacted_sliders = new Set();

    sliders.forEach(function(slider, index) {
      slider.setAttribute("data-slider-idx", index);
      slider.addEventListener("input", function(e) {
        var idx = e.target.getAttribute("data-slider-idx");
        interacted_sliders.add(idx);
        if (interacted_sliders.size === total_sliders) {
          if (submit_btn) {
            submit_btn.disabled = false;
            submit_btn.style.opacity = "1";
          }
        }
      });
    });
  }
};

/*4. Data Processing*/
var process_survey_data = {
  type: jsPsychCallFunction,
  func: function() {
    var survey_trial = jsPsych.data.get().filter({ phase: 'survey_rating_leisure' }).values();
    var responses = survey_trial.response; 

    var rated_activities = leisure_activities.map(function(activity_string, index) {
      var score_key = "leisure_" + index;
      return { 
        activity: activity_string, 
        rating: parseFloat(responses[score_key]) 
      };
    });
    
    var randomized_before_sort = jsPsych.randomization.shuffle(rated_activities);
    randomized_before_sort.sort(function(a, b) { return b.rating - a.rating; });
    
    top_activities = randomized_before_sort.slice(0, 6).map(function(item) { return item.activity; });
    console.log("Top 6 selected leisure activities from pool:", top_activities);

    //write top_activities into jsPsych data so Qualtrics can recover it 
    jsPsych.data.addProperties({ top_activities: top_activities });
  }
};

/*5. Dynamic Choice Task: Presents Combinations of different Math Tasks with Leisure Options that are most Subjectively Enjoyable to Participant, based on their Ratings*/
var choice_task_instructions = {
  type: jsPsychHtmlButtonResponse,
  choices: ['OK'],
  stimulus: "<p><b>Instructions:</b> In this task, you will be presented with a choice between two options:</p>" +
            "<p>           1) A <b>leisure activity</b> that you might find enjoyable on one side of the screen</p>" +
            "<p>           1) A <b>math task</b> with a specific deadline and worth a percentage of your grade on the other side of the screen.</p>" +
            "<p>For each choice, use your mouse to choose the <b>leisure activity</b> or the <b>math task</b>.</p>" +
            "<p>If you understand these instructions, click <b>OK.</b></p>",
  allow_keys: false,
  post_trial_gap: 1000
};

var choice_task_timeline = {
  timeline: [
    {
      // Present a break to participants every 36 trials
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>Take a break if needed, and press the spacebar when you are ready to continue.</p>",
      choices: [' '],
      conditional_function: function() {
        var trials_done = jsPsych.data.get().filter({ phase: '2afc_choice' }).count();
        return trials_done > 0 && trials_done % 36 === 0;
      }
    },
    {
      // Trial presentations
      type: jsPsychHtmlButtonResponse,
      stimulus: "<h2>Which would you do:</h2>",
      choices: function() {
        var leisure = jsPsych.timelineVariable('leisure');
        var math = jsPsych.timelineVariable('math');
        
        var math_string = `${math.action} ${math.type} worth ${math.weight} of your grade due in ${math.deadline}`;
        
        var standard_choices = [leisure, math_string];
        var shuffled_choices = jsPsych.randomization.shuffle(standard_choices);
        
        this.current_left = shuffled_choices;
        this.current_right = shuffled_choices;
        
        return shuffled_choices; 
    },
    button_html: '<button class="jspsych-btn" style="width: 320px; min-height: 140px; margin: 20px; font-size: 18px; padding: 15px; white-space: normal;">%choice%</button>',
    data: {
      phase: '2afc_choice',
      leisure_option: jsPsych.timelineVariable('leisure'),
      math_action: function() { return jsPsych.timelineVariable('math').action; },
      math_type: function() { return jsPsych.timelineVariable('math').type; },
      math_weight: function() { return jsPsych.timelineVariable('math').weight; },
      math_deadline: function() { return jsPsych.timelineVariable('math').deadline; },
      button_left_text: function() { return this.current_left; },
      button_right_text: function() { return this.current_right; }
    },
    on_finish: function(data) {
      var chosen_text = (data.response === 0) ? data.button_left_text : data.button_right_text;
      
      if (chosen_text === data.leisure_option) {
        data.choice_category = 'leisure';
        data.selected_alternative = data.leisure_option;
      } else {
        data.choice_category = 'math';
        data.selected_alternative = `${data.math_action} ${data.math_type}`;
      }
    }
  }],

// 216-combination loop
  timeline_variables: function() {
    var combinations = [];
    var flat_math_tasks = [];
    
    // 1. Math array: 6 configurations
    math_assignments.forEach(function(item) {
      if (Array.isArray(item.weight)) {
        item.weight.forEach(function(w) {
          flat_math_tasks.push({
            action: item.action,
            type: item.type,
            weight: w
          });
        });
      } else {
        flat_math_tasks.push({
          action: item.action,
          type: item.type,
          weight: item.weight
        });
      }
    });

    // 2. 6 Leisure x 6 Math Tasks x 6 Deadlines = 216 Trials
    for (var i = 0; i < top_activities.length; i++) {       
      for (var j = 0; j < flat_math_tasks.length; j++) {    
        for (var k = 0; k < deadlines.length; k++) {    
          
          combinations.push({
            leisure: top_activities[i],
            math: {
              action: flat_math_tasks[j].action,
              type: flat_math_tasks[j].type,
              weight: flat_math_tasks[j].weight,
              deadline: deadlines[k]
            }
          });
          
        }
      }
    }
    
    return jsPsych.randomization.shuffle(combinations);
  }
};

/*6. Debrief:*/
var debrief = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ['OK'],
  stimulus: "<p>Thank you for completing this part of the experiment. Press any key to be redirected for crediting. Thank you!</p>",
  allow_keys: false,
  post_trial_gap: 1000
};

/*7. Set Up Experiment Timeline*/
var timeline = [];
timeline.push(welcome); // Presents welcome page
timeline.push(instructions); // Presents initial instructions
timeline.push(leisure_survey_page); // Presents leisure activity survey
timeline.push(math_survey_page); // Presents math activity survey
timeline.push(process_survey_data);  // Computes top_activities
timeline.push(choice_task_instructions); // Presents choice task instructions
timeline.push(choice_task_timeline); // Generates and runs 216 trials
timeline.push(debrief);

/* Remove comment notation below if want to run in browser */
/*start experiment*/
jsPsych.run(timeline);
