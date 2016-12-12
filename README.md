# Setting up the project
Make sure [Node](https://nodejs.org/en/) with `npm` is installed and your CLI is pointed to this projects folder.

If you don't already have gulp installed globally you need to run `npm install gulp -g`. This is required to run gulp commands from CLI.

Install the required Node modules by running `npm install`. This might take a while.

Next, we'll want to build the projects source files. To do this you just need to run `gulp`. This will compile all .sass and .js files as well as compress images.

Now the project is set up. You can either directly open `app/index.html` in a webbrowser or run `node run.js` and visit [localhost:8000](http://localhost:8000)

# Contributing

Instead of running `gulp` every time you edit something and want to view your changes you can use `gulp watch` to automatically rebuild the source whenever a file is changed.
