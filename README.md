[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/digi-serve/plugin_ABDesigner/pr-merge-release.yml?logo=github&label=Build%20%26%20Test)](https://github.com/digi-serve/plugin_ABDesigner/actions/workflows/pr-merge-release.yml)
[![GitHub tag (with filter)](https://img.shields.io/github/v/tag/digi-serve/plugin_ABDesigner?logo=github&label=Latest%20Version)
](https://github.com/digi-serve/plugin_ABDesigner/releases)

# AppBuilder Designer
A plugin for the AppBuilder platform that enables creating AB resources.

## Install
See [ab_cli](https://github.com/digi-serve/ab-cli)

## Pull Requests
Pull Requests should be tagged with a label `major`, `minor` or `patch`. Use `major` for breaking changes, `minor` for new features, or `patch` for bug fixes. To merge without creating a release a `skip-release` tag can be added instead.

:pencil: In the pull request body add release notes between these tags:
```md
<!-- #release_notes -->

<!-- /release_notes --> 
```
Anything between those 2 lines will be used as release notes when creating a version.

### When merged:
 - A new version will be created using semantic versioning
 - The version will be updated in `package.json`
 - A new tag and release will be created on GitHub
 - A Workflow in `AppBuilder Service Web` will be triggered to build a new Image.
     rm the old generated ABDesigner.js