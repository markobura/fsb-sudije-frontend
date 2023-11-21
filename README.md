# PROJECT SETUP

## * BEFORE START

- It is required to have `Docker` and `Make command` installed.


### If you want to start project from command line (terminal) following steps are required!
### If you want to clone project from GitHub skip following steps!


- You have to create folder named `Projects` on  `Desktop`. 
(If your folder have different name, in zshrc file you need to change all paths)


- Open editor click `Tools` from navigation bar and chose `Create Command-line launcher...`, than click OK.


- Open command line and write `nano ~/.zshrc` / `webstorm ~/.zshrc ` / `pstorm ~/.zshrc ` / `code ~/.zshrc `


- In ZSHRC file copy following:

```
function projectCreate(){
    echo -e "\033[33mPlease select type of project (Values can be, app, api or full)\033[0m"
    read projectType
    if [ "$projectType" = "api" ];then
    echo -e "\033[33mApi project creation initialized!\033[0m"
    echo -e "\033[33mINFO: Default project directory is Desktop/Projects\033[0m"
    echo -e "\033[33mPlease enter main project directory name\033[0m"
    read mainProjectDirectoryName
    echo -e "\033[33mPlease enter project directory name\033[0m"
    read projectDirectoryName
    echo -e "\033[33mPlease enter project bootstrap type (values can be sm or lm)\033[0m"
    read bootstrapType
    echo -e "\033[33mProject initializing!\033[0m"
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName
    cd ~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName

    if [ "$bootstrapType" = "sm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/laravel-project-starter.git .
    rm -rf .git
    pstorm .
    fi

    if [ "$bootstrapType" = "lm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/laravel-project-starter-large-menu.git .
    rm -rf .git
    pstorm .
    fi

    echo -e "\033[32mProject initialized @~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName with bootstrap type: $bootstrapType \033[32m"
    fi

    if [ "$projectType" = "app" ];then
    echo -e "\033[33mApp project creation initialized!\033[0m"
    echo -e "\033[33mINFO: Default project directory is Desktop/Projects\033[0m"
    echo -e "\033[33mPlease enter main project directory name\033[0m"
    read mainProjectDirectoryName
    echo -e "\033[33mPlease enter project directory name\033[0m"
    read projectDirectoryName
    echo -e "\033[33mPlease enter project bootstrap type (values can be sm or lm)\033[0m"
    read bootstrapType
    echo -e "\033[33mProject initializing!\033[0m"
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName
    cd ~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName

    if [ "$bootstrapType" = "sm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/quasar-project-starter.git .
    rm -rf .git
    webstorm .
    fi

    if [ "$bootstrapType" = "lm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/quasar-project-starter-large-menu.git .
    rm -rf .git
    webstorm .
    fi


    echo -e "\033[32mProject initialized @~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName with bootstrap type: $bootstrapType \033[32m"
    fi

    if [ "$projectType" = "full" ];then
    echo -e "\033[33mFull project creation initialized!\033[0m"
    echo -e "\033[33mINFO: Default project directory is Desktop/Projects\033[0m"
    echo -e "\033[33mPlease enter main project directory name\033[0m"
    read mainProjectDirectoryName
    echo -e "\033[33mPlease enter project API directory name\033[0m"
    read projectApiDirectoryName
    echo -e "\033[33mPlease enter project APP directory name\033[0m"
    read projectAppDirectoryName
    echo -e "\033[33mPlease enter project bootstrap type (values can be sm or lm)\033[0m"
    read bootstrapType
    echo -e "\033[33mProject initializing!\033[0m"
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/$projectApiDirectoryName
    mkdir ~/Desktop/Projects/$mainProjectDirectoryName/$projectAppDirectoryName

    cd ~/Desktop/Projects/$mainProjectDirectoryName/$projectApiDirectoryName
    if [ "$bootstrapType" = "sm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/laravel-project-starter.git .
    rm -rf .git
    pstorm .
    fi

    if [ "$bootstrapType" = "lm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/laravel-project-starter-large-menu.git .
    rm -rf .git
    pstorm .
    fi

    cd ~/Desktop/Projects/$mainProjectDirectoryName/$projectAppDirectoryName
    if [ "$bootstrapType" = "sm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/quasar-project-starter.git .
    rm -rf .git
    webstorm .
    fi

    if [ "$bootstrapType" = "lm" ];then
    rm -rf .*
    git clone https://github.com/kentkartSEE/quasar-project-starter-large-menu.git .
    rm -rf .git
    webstorm .
    fi

    echo -e "\033[32mProject initialized @~/Desktop/Projects/$mainProjectDirectoryName/$projectDirectoryName with bootstrap type: $bootstrapType \033[32m"
    fi
}
```
- If you opened zshrc file with `nano` close it with `control+c` than click `y` and press `enter`

- Now to save changes in zshrc file type `source ~/.zshrc` in command line 

## First step => Starting from command line (terminal)

- Open command line and type `projectCreate` and press `enter`


### - Here are presented answers to questions in command line: 


- Please select type of project (Values can be, app, api or full) : `app`
- Please enter main project directory name: example: `template-project` 
- Please enter project APP directory name: example: `template-project-app`
- Please enter project bootstrap type (values can be sm or lm): for small menu `sm`, for large menu `lm`

## First step => Cloning project from GitHub

- On `Desktop` create folder `Projects`. In that folder create main project directory, for example `template-project`,
than inside `template-project` create project APP directory, for example `template-project-app`.

-  Open terminal and type `cd/Desktop/Projects/template-project/template-project-app` and press `enter`.
- Now in terminal type following command: `git clone https://github.com/kentkartSEE/quasar-project-starter-large-menu.git .`
  and press `enter`. ( Make sure that you are in the right directory) 
#### If you want you can manually go to GitHub and follow instructions:
-  Go to GitHub (url: `https://github.com/kentkartSEE/quasar-project-starter-large-menu`), click on green button `<> Code` and copy url. 
-  Now in terminal and type: `git clone url .` and press `enter`. *** `url = url that you copied from GitHub`
   ( Make sure that you are in the right directory)


## Second step => Starting project from editor

- Open Webstorm
#### * If you have done first step with CLONING project from GitHub, type following command in project terminal: `rm -rf.git` ( If you have done first step from COMMAND LINE (TERMINAL), ignore this command
- In command line: create `.env.git` with following command: `touch .env.git` and fill it with your data.
- Make sure that in `.git.ignore` file there are `.env.git` and  `.env`
- CLOSE ALL CONTAINERS IN DOCKER DESKTOP!
- In terminal type : `make install`
- Quasar CLI answers are:
```
- Ok to proceed? (y) => y
- What would you like to build? => App with Quasar CLI, let's go!
- Project-folder =>  app
- Pick Quasar version => Quasar v2 (Vue 3 | latest and greatest)
- Pick script type => Typescript
- Pick Quasar App CLI variant =>  Quasar App CLI with Vite
- Package name: // just press enter you don't need to write anything
- Project product name: (must start with letter if building mobile apps) // just press enter you don't need to write anything
- Project description:  // just press enter you don't need to write anything
- Author: // just press enter you don't need to write anything
- Pick a Vue component style => Composition API with <script setup>
- Pick your CSS preprocessor => Sass with SCSS syntax
- Check the features needed for your project => ES Lint, State Management(Pinia), Axios
- Pick an ESLint preset => Prettier
- Install project dependencies? (recommended) => No, I will handle that  myself
```
- When Quasar CLI is successfully installed type `make setup` in terminal.

## Third step => GitHub

- Create new repository on GitHub.
- Type all following commands from GitHub in project terminal.
- Make branches with :

`git checkout -b branch_name` 

`git push --set-upstream origin branch_name`