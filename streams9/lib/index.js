var fs = require('fs');
var streams2 = require('./streams2');
var streams3 = require('./streams3');
var streams4 = require('./streams4');
var streams5 = require('./streams5');
var streams9 = require('./streams9');

var createProjectObjectModels = streams9.createProjectObjectModels;
var createProjectWorkspace = streams9.createProjectWorkspace;
var getCoreDetails = streams5.getCoreDetails;
var getCoreFolders = streams5.getCoreFolders;
var getFilePath = streams5.getFilePath;
var getModuleDetails = streams4.getModuleDetails;
var getModuleFolders = streams3.getModuleFolders;
var getPluginDetails = streams5.getPluginDetails;
var isDirectory = streams2.isDirectory;

function createProject(portalSourceFolder, otherSourceFolders) {
	var initialCWD = process.cwd();

	process.chdir(portalSourceFolder);

	if (!isDirectory('.idea')) {
		fs.mkdirSync('.idea');
	}

	if (!isDirectory('.idea/libraries')) {
		fs.mkdirSync('.idea/libraries');
	}

	var coreFolders = getCoreFolders();

	var portalSourceModulesRootPath = getFilePath(portalSourceFolder, 'modules');

	var moduleFolders = getModuleFolders(portalSourceFolder, portalSourceModulesRootPath, true);
	var pluginFolders = [];

	for (var i = 0; i < otherSourceFolders.length; i++) {
		var otherSourceFolder = otherSourceFolders[i];

		if (otherSourceFolder.indexOf('modules') != -1) {
			var newFolders = getModuleFolders(portalSourceFolder, otherSourceFolder);

			moduleFolders = moduleFolders.concat(newFolders);
		}
		else {
			var newFolders = getPluginFolders(portalSourceFolder, otherSourceFolder);

			pluginFolders = pluginFolders.concat(newFolders);
		}
	}

	var coreDetails = coreFolders.map(getCoreDetails);
	var moduleDetails = moduleFolders.map(getModuleDetails);
	var pluginDetails = pluginFolders.map(getPluginDetails);

	createProjectWorkspace(coreDetails, moduleDetails);

	process.chdir(initialCWD);
};

function prepareProject(portalSourceFolder, otherSourceFolders) {
	var initialCWD = process.cwd();

	process.chdir(portalSourceFolder);

	var portalSourceModulesRootPath = getFilePath(portalSourceFolder, 'modules');

	var moduleFolders = getModuleFolders(portalSourceFolder, portalSourceModulesRootPath, otherSourceFolders.length == 0);

	for (var i = 0; i < otherSourceFolders.length; i++) {
		var otherSourceFolder = otherSourceFolders[i];

		if (otherSourceFolder.indexOf('modules') != -1) {
			var newFolders = getModuleFolders(portalSourceFolder, otherSourceFolder);

			moduleFolders = moduleFolders.concat(newFolders);
		}
	}

	var moduleDetails = moduleFolders.map(getModuleDetails);

	createProjectObjectModels(moduleDetails);

	process.chdir(initialCWD);
};

exports.createProject = createProject;
exports.prepareProject = prepareProject;