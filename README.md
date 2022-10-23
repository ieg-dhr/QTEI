# QTEI

Visualize your TEI documents easily.

https://user-images.githubusercontent.com/506366/197420844-0f9e97ae-7043-4e7d-a625-ad920ab49b7f.mov

## Getting started

QTEI works as a ES6 module, can be used with the browser directly and ships a
development environment:

### ES6 module

Add QTEI to your javascript project with npm

    npm install @wendig/qtei -D
    
And then use it like this

    import QTei from '@wendig/qtei'
    const qtei = new QTei.Viewer(...)

### Directly with the browser 
    
Include it in your page with simple html tags

    <html>
      <head>
        ...
        <link
          rel="stylesheet"
          type="text/css" href="https://unpkg.com/@wendig/qtei/dist/qtei.min.css"
        />
        ...
      </head>
      <body>
        ...
        <script src="https://unpkg.com/@wendig/qtei/dist/qtei.min.js"></script>
        ...
      </body>
    </html>

### Development environment

This repository also ships with a development environment. This is how you set
it up:

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

## Usage

In general, the QTEI library can be used in two ways:

* use the integrated viewer (shows TEI XML source along rendered text
  with a facsimile and potentially a map). It provides a pagination, column
  controls and some styling but it isn't as customizable
* use just some parts of the library to build your own and integrate into your
  own systems

This is a example of a full html page making use of QTEI:

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
      type="text/css" href="https://unpkg.com/@wendig/qtei/dist/qtei.min.css"
    />

    <!-- include these if you intend to use the map component -->
    <link
      rel="stylesheet" href="https://unpkg.com/leaflet@1.9.1/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.9.1/dist/leaflet.js"></script>
  </head>
  <body>
    <div is="qtei-viewer"></div>

    <script src="https://unpkg.com/@wendig/qtei/dist/qtei.min.js"></script>
    <script>
      function renderFacsimile(data) {
        // write the code here to extract the facsimile from the current page's
        // xml, data.content is a reference to the XML DOM. Have a look at the
        // src/app.js file for an example implementation
      }

      function mappify(data) {
        // write the code here to extract geo location data from your pages to
        // be rendered within the leaflet map. Have a look at the src/app.js
        // file for an example implementation
      }

      var qtei = new QTei.Viewer('[is=qtei-viewer', {
        src: "url/to/your/tei.xml",
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

## Licenses

* https://freesvg.org/black-book-with-many-pages
* https://freesvg.org/tilted-grayscale-book
