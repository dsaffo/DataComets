<h1 id="welcome-to-data-comets">Welcome to Data Comets</h1>
<h3><a href="https://forms.gle/5BBUH4Fk6dK6FN499" target="_blank">Help us improve Data Comets with this short survey!</a></h3>
<p align="center"><img src="https://i.imgur.com/7oK0a5G.png" alt=""><img src="https://media.giphy.com/media/ZE6LoNdnVgrxBjwmLj/giphy.gif" alt=""></p>
<br>
<p>
Data Comets is a <strong>interactive PX4 flight log analysis tool</strong>. With Data Comets you can encode flight data onto the flight path, filter and brush the data by time, and much more! Data Comets was designed and is in development as a part of a information visualization design study from the Visualization Lab @ Northeastern University’s Khoury College of Computer Sciences. The tool is ready to be used but the project and the research is <strong>ongoing and seeking user feedback</strong>. Learn how you can help Data Comets and our design study in the <strong>contributing section</strong> below.</p>
<strong>discussion forum post: </strong><a href="https://discuss.px4.io/t/data-comets-a-new-flight-log-analysis-tool/12400">https://discuss.px4.io/t/data-comets-a-new-flight-log-analysis-tool/12400</a>

### Short Term Change Log:
v1.0.1 8/16/2019
FIXED: Color map not generating correctly for some attributes with undifned values. Data such as roll setpoints should encode correctly on the flight path now. 

<h1 id="using-data-comets">Using Data Comets</h1>
<h2 id="hosted-version">Hosted Version</h2>
<p>To try out Data Comets for yourself you can visit <a href="https://www.datacomets.com">datacomets.com</a>. The hosted version is limited to logs smaller than <strong>32mb</strong>. For larger logs and better performance/load times please use the local version. Uploaded logs are not saved once they are parsed and displayed. Refreshing the page will delete the log data from your browser as well.</p>
<h2 id="local-version">Local Version</h2>
<p>You can use Data Comets locally with python 3. Clone or download this repo, then using the terminal run the following commands in the directory.</p>
<pre><code>pip install -r requirements.txt
python DataCometsLocal.py
</code></pre>
<p>Data Comets will then run on your local host and should open automatically or it can be accessed by going to <strong><a href="http://localhost:5000/">http://localhost:5000/</a></strong> with your browser.</p>
<h2 id="features">Features</h2>
<p  align="center"><img width="48%" height="auto" src="https://media.giphy.com/media/L0Z7bjfOQh3NXRiKL5/giphy.gif" alt="enter image description here">  
<img width="48%" height="auto" src="https://media.giphy.com/media/LlDxytpwGRrW7PMHHY/giphy.gif" alt="enter image description here"> </p>
 <p>The map shows the recorded flight path, you can also encode the estimated flight path and set points from the settings menu that you can access with the gear icon at the top left of the map</p>
 <p>The flight path uses color to encode any data selected from the flight log. Select data such as altitude, velocity, or jamming to see where data was recorded or expected not just when. You can change the selected data by clicking the map icon found on each line chart </p>
 </p>
 <p  align="center"> 
<img width="48%" height="auto" src="https://media.giphy.com/media/Y4ypbcZNPLJh351dIk/giphy.gif" alt="enter image description here">
<img width="48%" height="auto" src="https://media.giphy.com/media/iDmwOAViweRtseACcW/giphy.gif" alt="enter image description here"></p>
   <p>You can prowse all the data in the log using the line chart tree. The overview tab show a highlevel view of some important charts similar to the charts found on the flight review tool. You can look through all the data from the flight in the all tab where the data is orgainzed into a drop down tree by the message file they belong to. You can pin data you want to compare or get a closer look at with the pin icon found on every linechart. Pinned data will apear in the pin tab.</p>
 <p>Data Comets is fully interactive! Brush the timeline at the bottom to filter the amount of time shown. Use this to reduce visual cluter on longer complex flight paths, or to drill down into certain trouble areas of a flight. The line charts will update to show the time windo selected. You can also use the brushing window to play back the flight by scrubing the window as you please. All the charts are linked! Hover over the line charts or map to see that position on the other charts.</p>
  </p>


<h1 id="contributing">Contributing</h1>
<p>Interested in contributing? Even just <strong>giving your feedback</strong> is a huge help! Below are a few of the ways anyone can help contribute to this project.</p>
<ol>
 <li><strong>Give Us Your Feedback!</strong> We are currently in the evaluation phase of our design study and are seeking user feedback<br>
- Leave questions, comments, ideas, and feedback (positive or negative) over on the discussion topic here<br>
- If you have been using the tool please take this survey to help us evaluate the project<br>
- Have you found anything interesting in your logs with Data Comets? We would love to hear your stories using<br>
using the tool and potential use them as <strong>case studies</strong> for our publication.<br>
- Raising issues on this repo with any bugs or suggestions or questions you may have.</li>
 <li><strong>A JavaScript and or web-based ULog parser</strong>. This would be a huge help for not only this project but other and future 		PX4/Dronecode projects on the web. Currently we are using PyUlog package to parse the logs into a suitable format for the web. A native JS parser would simplify and speed up things quite a bit.</li>
<li><strong>Adding to the Lexicon</strong>. In the Lexicon folder there is a json file which contains information about all the possible data you can find in any given ULog. This was gererated by parsing through the .msg file source code and is not nearly complete. Filling in info about proper titles, descriptions, and units will help future versions of Data Comets. The lexicon will eventually be implemented to give all charts more accurate labels and encoding. The lexicon will also help serve ULog documentation in general.</li>
<li>If you are confident enough for changes to the code feel free to submit a pull request and I will be more than happy to review it and merge good changes or additions.</li>
</ol>
<h1 id="future-versions">Future Versions</h1>
<p>What can you expect from Data Comets in the future? I still have a lot planned for this tool and similar research projects so stayed tuned! Things to expect in the nearish future include</p>
<ol>
<li>Changes, fixes, and additions based on community feedback</li>
<li>Performance optimizations to better handle very large logs (1+ hours flights)</li>
<li>Improved code styles, architecture, and documentation</li>
<li>Implementing the Lexicon to give all plots accurate titles and unit labels</li>
<li>Search functionality</li>
<li>3D drone orientation and position plots</li>
<li>Pure web-based implementation with out the need of a python backed for parsing</li>
</ol>
