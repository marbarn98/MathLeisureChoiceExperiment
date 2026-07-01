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
  pages: [[{ type: "text", prompt: "placeholder", name: "placeholder" }]],
  title: "Part 1: Leisure Activities",
  show_question_numbers: "off",
  on_start: function(trial) {
    var questions = leisure_activities.map(function(activity_string, index) {
      return {
        type: "text",
        name: "leisure_" + index,
        prompt: activity_string,
        input_type: "range",
        required: false
      };
    });
    trial.pages = [jsPsych.randomization.shuffle(questions)];
  },
  data: { phase: 'survey_rating_leisure' },
  on_load: function() {

    // Global CSS overrides to fix layouts and button alignment
    if (!document.getElementById("custom-survey-overrides")) {
        var styleEl = document.createElement("style");
        styleEl.id = "custom-survey-overrides";
        styleEl.innerHTML = `
            // Make survey title black text
            .sv_header h3, .sv-title, .sv-header__title, h3.sv_title {
                color: #000000 !important;
            }
    
            #leisure-desc { font-size: 1.05em !important; font-weight: normal !important; text-align: left !important; margin: 15px 20px !important; display: block !important; }
            .sv-question, .sv_q { padding-top: 25px !important; padding-bottom: 25px !important; }
            .sv-question__title, .sv_q_title, .sv-string-viewer { font-size: 1.25em !important; font-weight: 600 !important; color: #222 !important; text-align: center !important; display: block !important; margin-bottom: 12px !important; }
            input[type='range'] { width: 100% !important; max-width: 500px !important; display: block !important; margin: 0 auto !important; }
            .slider-labels { display: flex !important; justify-content: space-between !important; font-size: 0.88em !important; color: #666 !important; margin: 8px auto 0 auto !important; width: 100% !important; max-width: 500px !important; padding: 0 4px !important; box-sizing: border-box !important; }
            
            // Overhaul all possible footer/navigation wrappers to make sure finish button is centered 
            .sv-footer, .sv-action-bar, .sv_nav, .sv-footer__container, .sv-footer__right, .sv-action-bar--right { 
                display: flex !important; 
                justify-content: center !important; 
                align-items: center !important;
                float: none !important;
                text-align: center !important;
                margin: 0 auto !important;
                width: 100% !important; 
                padding: 25px 0 !important; 
            }
            
            // Make sure inner flexbox alignments built into SurveyJS elements do not force button to go to the right 
            .sv-footer__right, .sv-action-bar--right {
                float: none !important;
                margin: 0 auto !important;
            }
    
            .sv-btn.sv-footer__complete-btn, .sv_complete_btn { display: inline-block !important; padding: 14px 50px !important; font-size: 1.15em !important; font-weight: bold !important; color: #fff !important; border: none !important; border-radius: 6px !important; cursor: pointer !important; transition: all 0.2s ease !important; box-shadow: 0 3px 6px rgba(0,0,0,0.1) !important; }
            .btn-locked { background-color: #a0a0a0 !important; opacity: 0.85 !important; }
            .btn-unlocked { background-color: #007bff !important; box-shadow: 0 4px 12px rgba(0,123,255,0.35) !important; opacity: 1.0 !important; }
        `;
        document.head.appendChild(styleEl);
    }

    setTimeout(function() {
      // Description that goes below title
      var title_el = document.querySelector(".sv_header h3");
      if (title_el && !document.querySelector("#leisure-desc")) {
        var desc = document.createElement("p");
        desc.id = "leisure-desc";
        desc.style.cssText = "font-size:1em; font-weight:normal; margin: 15px 20px; line-height: 1.5; text-align: left;";
        desc.innerHTML = "<b>Instructions:</b> Please rate the following leisure activities and hobbies below, based on how enjoyable or unenjoyable you find them. Some of these activities may not exactly match your preferences, but please try to rate based on how close it is to one of your preferred activities (For example: if you like card games/tabletop games/tile games, then you should rate the 'Play board games with friends' option highly).";
        title_el.parentNode.insertBefore(desc, title_el.nextSibling);
      }
    
      // Set min, max, step, defaultValue on all sliders
      var sliders = document.querySelectorAll("input[type='range']");
      sliders.forEach(function(slider) {
        slider.setAttribute("min", "-5");
        slider.setAttribute("max", "5");
        slider.setAttribute("step", "0.01");
        slider.setAttribute("value", "0");
        slider.value = "0";

        // Make slider wider but still clean and usable
        slider.style.cssText = "width: 100%; max-width: 500px; display: block; margin: 0 auto;";
            
        // Make question text larger than slider labels
        var questionWrapper = slider.closest(".sv-question, .sv_q, .sv-row");
        if (questionWrapper) {
            // Add vertical spacing between each separate activity block
            questionWrapper.style.paddingTop = "25px";
            questionWrapper.style.paddingBottom = "25px";
                
            // Increase font size of the activity title text
            var questionTitle = questionWrapper.querySelector(".sv-question__title, .sv_q_title, h5, span");
            if (questionTitle) {
                questionTitle.style.cssText = "font-size: 1.25em; font-weight: 600; color: #333; display: block; text-align: center; margin-bottom: 12px;";
            }
        }
        
        // Add min/max labels under each slider (should match 500px slider max width
        if (!slider.nextSibling || !slider.nextSibling.classList || !slider.nextSibling.classList.contains("slider-labels")) {
          var labels = document.createElement("div");
          labels.className = "slider-labels";
          labels.style.cssText = "display:flex; justify-content:space-between; font-size:0.85em; color:#333; margin: 8px auto 0 auto; width: 100%; max-width: 500px; padding: 0 4px; box-sizing: border-box;";
          labels.innerHTML = "<span>Unenjoyable (-5)</span><span>Neutral (0)</span><span>Enjoyable (+5)</span>";
          slider.parentNode.insertBefore(labels, slider.nextSibling);
        }
      });
  
      // Lock submit button until all sliders are interacted with. Center finish button and default to grey until interacted with
      var submit_btn = document.querySelector(".sv-btn.sv-footer__complete-btn, .sv_complete_btn");

      // Track how many sliders have moved
      var total_sliders = sliders.length;
      var interacted_sliders = new Set();
      var forms_completed = false; // Tracks if all sliders are done
      
      if (submit_btn) { 
          // Keep the button clickable so we can catch early clicks
          submit_btn.disabled = false; 
          submit_btn.classList.add("btn-locked"); 
          
          // Check if the user is allowed to finish when they click the button
          submit_btn.addEventListener("click", function(e) {
              if (!forms_completed) {
                  // Stop the form from submitting and show the warning popup
                  e.preventDefault();
                  alert("All responses are required. Please interact with every slider on the page before clicking Finish.");
              }
              // Fix: Removed stopPropagation so jsPsych can read the click when forms_completed is true!
          }); 
      } 

      // 4. Watch the sliders to see when the user moves them
      sliders.forEach(function(slider, index) { 
          slider.setAttribute("data-slider-idx", index); 
          slider.addEventListener("input", function(e) { 
              var idx = e.target.getAttribute("data-slider-idx"); 
              interacted_sliders.add(idx); 
              
              // If every single slider has been moved, unlock the page
              if (interacted_sliders.size === total_sliders) { 
                  forms_completed = true; 
                  if (submit_btn) { 
                      // Change the button color from grey to blue
                      submit_btn.classList.remove("btn-locked");
                      submit_btn.classList.add("btn-unlocked"); 
                  } 
              } 
          }); // closes addEventListener
      }); // closes sliders.forEach

      // Lock submit button logic until all sliders interacted with 
      var total_sliders = sliders.length;
      var interacted_sliders = new Set();
      var forms_completed = false;

      // Custom validation check on the finish button click event
      if (submit_btn) {
        // Remove any old custom listeners to prevent duplication
        var new_submit = submit_btn.cloneNode(true);
        submit_btn.parentNode.replaceChild(new_submit, submit_btn);
        submit_btn = new_submit;

        submit_btn.addEventListener("click", function(e) {
          if (!forms_completed) {
            // Prevent form submission if not all forms (aka sliders) completed
            e.preventDefault();
            e.stopPropagation();
            // Display browser warning popup window
            alert("All responses are required. Please interact with every slider on the page before clicking Finish.");
          }
        });
      }
  
      sliders.forEach(function(slider, index) {
        slider.setAttribute("data-slider-idx", index);
        slider.addEventListener("input", function(e) {
          var idx = e.target.getAttribute("data-slider-idx");
          interacted_sliders.add(idx);

          // If all sliders interacted with, then unlock form to go to next page
          if (interacted_sliders.size === total_sliders) {
            forms_completed = true;
            if (submit_btn) {
              submit_btn.classList.remove("btn-locked");
              submit_btn.classList.add("btn-unlocked");  // Visual cue that it's clickable; Changes from grey to blue when unlocked
            }  // closes if (submit_btn)
          }    // closes if (interacted_sliders.size...)
        });    // closes addEventListener
      });      // closes sliders.forEach
    }, 100);   // closes setTimeout; small delay, should let Knockout finish rendering
  }            // closes on_load: function()
};             // closes leisure_survey_page

/*3. Survey Block - Part 2: Math Tasks*/
var math_survey_page = {
  type: jsPsychSurvey,
  pages: [[{ type: "text", prompt: "placeholder", name: "placeholder" }]],
  title: "Part 2: Math Activities",
  show_question_numbers: "off",
  on_start: function(trial) {
    var questions = math_assignments.map(function(math, index) {
      return {
        type: "text",
        name: "math_" + index,
        prompt: `${math.action} ${math.type}`,
        input_type: "range",
        required: false
      };
    });
    trial.pages = [jsPsych.randomization.shuffle(questions)];
  },
  data: { phase: 'survey_rating_math' },
  on_load: function() {
    setTimeout(function() {
      // Description that goes below title
      var title_el = document.querySelector(".sv_header h3");
      if (title_el && !document.querySelector("#leisure-desc")) {
        var desc = document.createElement("p");
        desc.id = "leisure-desc";
        desc.style.cssText = "font-size:0.9em; font-weight:normal; margin: 10px 20px;";
        desc.innerHTML = "<b>Instructions:</b> Please rate the following math activities below, based on how enjoyable or unenjoyable you find them.";
        title_el.parentNode.insertBefore(desc, title_el.nextSibling);
      }
      
      // Set min, max, step, defaultValue on all sliders
      var sliders = document.querySelectorAll("input[type='range']");
      sliders.forEach(function(slider) {
        slider.setAttribute("min", "-5");
        slider.setAttribute("max", "5");
        slider.setAttribute("step", "0.01");
        slider.setAttribute("value", "0");
        slider.value = "0";
  
        // Add min/max labels under each slider
        if (!slider.nextSibling || !slider.nextSibling.classList || !slider.nextSibling.classList.contains("slider-labels")) {
          var labels = document.createElement("div");
          labels.className = "slider-labels";
          labels.style.cssText = "display:flex; justify-content:space-between; font-size:0.85em; color:#333; margin-top:4px; padding: 0 2px;";
          labels.innerHTML = "<span>Unenjoyable (-5)</span><span>Neutral (0)</span><span>Enjoyable (+5)</span>";
          slider.parentNode.insertBefore(labels, slider.nextSibling);
        }
      });
  
      // Lock submit button until all sliders are interacted with
      var submit_btn = document.querySelector(".sv-btn.sv-footer__complete-btn, .sv_complete_btn");
      if (submit_btn) {
        submit_btn.disabled = true;
        submit_btn.style.opacity = "0.5";
      }
  
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
            }  // closes if (submit_btn)
          }    // closes if (interacted_sliders.size...)
        });    // closes addEventListener
      });      // closes sliders.forEach
    }, 100);   // closes setTimeout; small delay, should let Knockout finish rendering
  }            // closes on_load: function()
};             // closes math_survey_page

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
  }
],

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
