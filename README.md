# Setting up the project
Open your preferred command line and clone the repo with `git clone https://github.com/imdcc1/abgabe-DavideBecker.git`.

Make sure [Node](https://nodejs.org/en/) with `npm` is installed and your CLI points to the projects root folder (Where this readme file is).

If you don't already have gulp installed globally you need to run `npm install gulp-cli -g`. This is required to run gulp commands from CLI.

Install the required Node modules by running `npm install`. This might take a while.

Next, we'll want to build the projects source files. To do this you just need to run `gulp`. This will compile all .sass and .js files as well as compress images.

Now the project is set up. You can either directly open `app/index.html` in a webbrowser or run a server with `npm start` and visit [localhost:8080](http://localhost:8080) (Port may vary)

# Demos
After building the source with the `gulp` command, you can find some basic demos in `app/demos`  ([localhost:8080/demos](http://localhost:8080/demos) if you're running the local node server)

# Contributing
Instead of running `gulp` every time you edit something and want to view your changes you can use `gulp watch` to automatically rebuild the source whenever a file is changed.

# Linting
There are preconfigured eslint and sass-lint files in this project. If you're using atom you can install these plugins to enable live linting:

[linter](https://atom.io/packages/linter)    
[linter-eslint](https://atom.io/packages/linter-eslint)    
[linter-sass-lint](https://atom.io/packages/linter-sass-lint)    
