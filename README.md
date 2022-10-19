# QTEI

Visualize your TEI documents easily.

## Usage

The QTEI.js library can be used in two ways:

* use the integrated viewer (shows TEI XML source along rendered text
  with a facsimile and potentially a map). It provides a complete experience but
  isn't as customizable out of the box
* use just some parts of the library to build your own and integrate into your
  own systems

Either way, QTei works either through a `<script>` tag or as a es6 module. An
easy way to get started is to use the integrated development environment which
allows you to change your XML or functionality on the fly.

## Getting started

Use something like the following code to include QTei in your web page or CMS:

~~~html
<!DOCTYPE html>

<html>
  <head>
    <!-- when using the viewer widget, also include bootstrap to provide a
      default look, otherwise, just write your own css -->
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/bootswatch@5.2.2/dist/journal/bootstrap.min.css"
    />

    <!-- include the css for highlighting the XML TEI source (highlight.js) -->
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/github.min.css"
    />

    <link
      rel="stylesheet"
      type="text/css" href="https://unpkg.com/@wendig/qtei@0.6.1/dist/qtei.min.css"
    />

    <!-- include these if you intend to use the map component -->
    <link
      rel="stylesheet" href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
  </head>
  <body>
    <div is="qtei-viewer"></div>

    <script src="https://unpkg.com/@wendig/qtei@0.6.1/dist/qtei.min.js"></script>
    <script>
      var qtei = new QTei.Viewer('[is=qtei-viewer', {
        src: "content.xml",
        processors: [
          QTei.processors.wrapAll('persName', 'person-fill', 'person'),
          QTei.processors.wrapAll("rs[type='person']", 'person-fill', 'person'),
          QTei.processors.wrapAll('placeName', 'geo-alt-fill', 'place'),
          QTei.processors.wrapAll("rs[type='artwork']", 'palette-fill', 'artwork'),
          QTei.processors.renderXmlTo('#raw'),
          QTei.processors.highlightXml('#raw'),
          QTei.processors.renderContentTo('#content')
        ]
      })
    </script>
  </body>
</html>
~~~

Alternatively, add it to our project with npm:

    npm install @wendig/qtei

And then

    import QTei from '@wendig/qtei'
    const qtei = new QTei.Viewer(...)
    ...

## Development

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

## Licenses

* https://freesvg.org/black-book-with-many-pages
* https://freesvg.org/tilted-grayscale-book
