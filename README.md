# Gantt chart in D3
csv file has data in it.
Run on server so data can be read

This is is still a 0.1 version.

## Data

```
ID,Phase,Track,Title,Start,End,Line,Class,Group
1,discovery,Stacklife,Discovery & POC,Oct-1-2019,Feb-29-2020,1,discovery,StackLife
```

Phase:

Track: Label First Left column (duplicates are not shown)
Goup: Label Second column (dupliates are not shown)
Title: label in bar
Line: row  to show the bar
Class: Reference to CSS for style settings such as color etc.
Phase: not used
Start/End: in format MMM-D-YYYY (Mar-1-2020)

## TODOs


- [x] make size scalable when window is resized
- [x] make classes lower-case
- [x] Axis labels show end of Quarter instead of start of Quarter.
- [ ] Change font size according to bar size // update in layout
- [ ] Legend with explanation of colors/classes
- [ ] SVG doesn't support text areas with automatic text wrapping
- [ ] remove moment.js reference if it can be done in d3
- [ ] interaction (resize columns)
- [ ] tooltips
- [ ] Dependencies between (indicated with arrows)
- [ ] Think of definitions: Track, Group
- [ ] Add latest tick
- [ ] zoom out/in: weeks/months/Q's
- [ ] New views:
  - [ ] progress view (shows if certain item is on or ahead of schedule, started, not started, behind schedule)
  - [ ] Show progress in bars
- [ ] move/change/add/delete data in browser, save back the csv


# git repository
https://github.com/thebuunkenator/gantt-d3.git