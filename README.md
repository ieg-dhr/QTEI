# QTEI

Visualize your TEI documents easily

## Usage

The QTEI.js library can be integrated in projects in several ways:

* build the library and add it to your project (wordpress, drupal, static page
  etc.)
* use the development server to work on your TEI files or on the library's code
  itself (with live reload)

### Via Browser `<script>` Tag

Follow the [development setup guide](#via-a-local-development-environment) and
run npm run build. This buildes `qtei.js` and `qtei.css` to the `public/`
directory.

Now copy your TEI file to a directory in your project where it is available
with a url.

Then, copy `qtei.js` and `qtei.css` into your project and since it depends on
[twitter bootstrap](https://www.npmjs.com/package/bootstrap) for rendering,
Include that before as well, like this:

~~~html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT"
    crossorigin="anonymous"
  />

  <link rel="stylesheet" type="text/css" href="path/to/qtei.css" />
</head>
<body>
  <div id="viewer"></div>

  <script type="text/javascript" src="path/to/qtei.js"></script>
  <script type="text/javascript">
    var viewer = new TeiViewer('#viewer', {
      src: 'url/to/tei.xml',
    })
  </script>
</body>
</html>
~~~

This loads qtei.js from `path/to/qtei.js` and sets it up to instantiate a
TeiViewer within the first element matching the selector. The instance will
then load the tei file at `url/to/tei.xml`.

### Via a Local Development Environment

This repository comes with a development server preconfigured to render your
TEI document within a demo page.

First, install [git](https://git-scm.com/) and [nodejs](https://nodejs.org/) on
your workstation. Then open a terminal and clone the repository

    git clone https://github.com/ieg-dhr/QTEI.git

Rename your TEI file to `content.xml` and move it into the `data` directory.

Now install all dependencies and run the development server:

    cd QTEI
    npm install
    npm run dev

At this point, you should see your TEI file rendered at http://localhost:4000.
Use whatever editor you prefer to make modifications to the viewer itself or to
the TEI content, the page will immediately reflect the changes.


## Development

To get a development environment up and running, first follow the
[setup guide above](#via-a-local-development-environment). Modifications to the
component's configuration can be made in `app.js`. Specifically, a list of
processors can be configured to run on the content. Processors are simple
JavaScript functions and they receive one argument `content`, a dom node
representing the currently selected TEI page. Make whatever modifications you
see fit. For some examples, have a look at `lib/processors.js`. If you'd like
to use or wrap one of them, they are also available within the
`TeiViewer.processors` object.
