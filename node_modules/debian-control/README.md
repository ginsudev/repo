# debian-control
Parse package control files from Debian

## Motivation
The `debian-control` package provides parsing for Control files used by
the Debian Linux distribution. Control files contain metadata about Debian
packages, including both binary and source packages.

The metadata in Control files look like this:

    Package: bzflag-server
    Source: bzflag (2.4.18-1)
    Version: 2.4.18-1+b1
    Installed-Size: 3967
    Maintainer: Debian Games Team <pkg-games-devel@lists.alioth.debian.org>

By using the `parse()` function provided by this package, you can transform
the above into a JavaScript object like this:

    {
        "Package": "bzflag-server",
        "Source": "bzflag (2.4.18-1)",
        "Version": "2.4.18-1+b1",
        "Installed-Size": "3967",
        "Maintainer": "Debian Games Team <pkg-games-devel@lists.alioth.debian.org>"
    }

One caveat about parsing are folded and multiline fields. If you find this
in a Control file:

    Tag: implemented-in::c, interface::commandline, role::program,
     scope::utility, use::compressing, works-with-format::TODO,
     works-with::archive, works-with::file

Then `parse()` will translate this to:

    {
        "Tag": [
            "implemented-in::c, interface::commandline, role::program",
            "scope::utility, use::compressing, works-with-format::TODO",
            "works-with::archive, works-with::file:"
        ]
    }

However, the following form is also legal syntax for a Control file:

    Tag:
     implemented-in::c, interface::commandline, role::program,
     scope::utility, use::compressing, works-with-format::TODO,
     works-with::archive, works-with::file

This will be translated by `parse()` to this:

         {
             "Tag": [
                 "",
                 "implemented-in::c, interface::commandline, role::program",
                 "scope::utility, use::compressing, works-with-format::TODO",
                 "works-with::archive, works-with::file:"
             ]
         }

The empty string as the first member of the array is used to signify and
reconstruct the original format using the `stringify()` function. The API
of the `parse()` function is likely to change in a future release, making
this additional empty string an option.

## API and Examples
To make use of `debian-control`, use `require()` to gain access to the
classes and functions it provides:

    var debianControl = require("debian-control");

### Control Parsing
The `debian-control` package provides five functions to help with parsing
Control files from Debian Linux. If you need this package, likely you are
looking for the `parse()` function or `ParagraphStream` class.

#### isContinueLine
The `isContinueLine()` function is a low level function intended for
advanced use-cases only. It takes a single line of text and returns
`true` or `false` if the line is a continuation line:

    ({isContinueLine} = require("debian-control"));

    // no, this is a field line
    isContinueLine("Package: bzflag-server"); // false

    // yes, this is a continuation line
    isContinueLine(" scope::utility, use::compressing, works-with-format::TODO,"); // true

Generally, you don't need this function unless you are diving deep into
manually parsing a Control file on your own.

#### isFieldLine
The `isFieldLine()` function is a low level function intended for advanced
use-cases only. It takes a single line of text and returns `true` or `false`
if the line is a field line:

    ({isFieldLine} = require("debian-control"));

    // yes, this is a field line
    isFieldLine("Package: bzflag-server"); // true

    // no, this is a continuation line
    isFieldLine(" scope::utility, use::compressing, works-with-format::TODO,"); // false

Generally, you don't need this function unless you are diving deep into
manually parsing a Control file on your own.

#### parse
The `parse()` function translates the text of Control paragraph into a
JavaScript object. If you want to do some programmatic action with a Control
file for a package, this is the function you're looking for.

    ({parse} = require("debian-control"));
    var debianControlText = "..."; // text of Control paragraph here
    var obj = parse(debianControlText);
    console.log(obj.Package); // "bzflag-server"  (for example)

#### stringify
The `stringify()` function translates a JavaScript object into a Control
paragraph. This is the inverse operation of the `parse()` function, and
in many (although not all) cases, you can round-trip between a Control
paragraph and a JavaScript object:

    ({stringify} = require("debian-control"));
    var obj = {}; // JavaScript object for a Control paragraph here
    var debianControlText = stringify(obj);

#### stripSignature
The `stripSignature()` function is a low level function intended for advanced
use-cases only. It removes the header and footer of a PGP signature around a
Control paragraph.

    ({stripSignature} = require("debian-control"));
    var signedDebianControlText = "..."; // Control paragraph w/ PGP signature
    // no PGP signature on this copy of the Control paragraph
    var debianControlText = stripSignature(signedDebianControlText);

Generally, you don't need this function unless you are diving deep into
manually parsing Control paragraphs on your own.

### LineStream
The `LineStream` class is a `Transform` stream that breaks input down into
line-by-line blocks. This could be useful as a low-level building block if
you want to manually parse a Control file line by line.

    ({LineStream} = require("debian-control"));
    var fs = require("fs");
    var dscFile = fs.createReadStream("bzip2_1.0.6-8.1.dsc");
    var lineStream = new LineStream();
    lineStream.on("data", function(line) {
        // careful, you'll get a Buffer; convert to String
        console.log(line.toString().trim());
    });
    lineStream.on("end", function() {
        console.log("All done!");
    });

Generally, you don't need this class unless you are diving deep into
manually parsing Control paragraphs on your own.

### ParagraphStream
The `ParagraphStream` class is a `Transform` stream that breaks input down
into Control paragraphs. This class is useful for processing the large
`Packages` and `Sources` files that exist in Debian archives.

    ({parse, ParagraphStream} = require("debian-control"));
    var fs = require("fs");
    var dscFile = fs.createReadStream("Packages");
    var paragraphStream = new ParagraphStream();
    paragraphStream.on("data", function(line) {
        // careful, you'll get a Buffer; convert to String
        var obj = parse(line.toString());
        // do something with the JavaScript object...
    });
    paragraphStream.on("end", function() {
        console.log("All done!");
    });

This class can be useful if you are bulk processing the `Packages` (binary
packages) or `Sources` (source packages) files containing thousands of
Control paragraphs.

## Development
In order to make modifications to `debian-control`, you'll need to establish
a development environment:

    git clone https://github.com/blinkdog/debian-control
    cd debian-control
    npm install
    node_modules/.bin/cake rebuild

The `cake` command will list the tasks available in the `Cakefile`:

    node_modules/.bin/cake

### Code Coverage
You can see a test coverage report for `debian-control` using a task from
the Cakefile:

    node_modules/.bin/cake coverage

This task will attempt to open the coverage report in a new tab in Mozilla
Firefox. If you want to use another browser, you'll need to modify the
`BROWSER_COMMAND` at the top of the `Cakefile` to specify your preferred
browser for viewing the coverage report.

### Source files
The source files are located in `src/main/coffee`.

The test source files are located in `src/test/coffee`.

### Intensive tests
The test suite includes 85K+ Control paragraphs taken from Debian Linux 10,
in `Packages.xz` and `Sources.xz`. These tests are intensive and run in seconds
rather than milliseconds. By default, they are not enabled in the test suite.

    data
      - should unpack the data properly
      - should have 56805 paragraphs in Packages
      - should have 28497 paragraphs in Sources
      - should round trip the paragraphs in Packages
      - should round trip the paragraphs in Sources

If you want to run the full battery of intensive tests, change `xdescribe` to
`describe` in `src/test/coffee/dataTest.coffee` before running the test
suite with `cake rebuild`.

## References
* [Debian Policy Manual Chapter 5: Control files and their fields](https://www.debian.org/doc/debian-policy/ch-controlfields.html)
* [RFC 5322: Internet Message Format](https://tools.ietf.org/html/rfc5322)
* [Transform Stream](https://nodejs.org/dist/latest/docs/api/stream.html#stream_duplex_and_transform_streams)

## License
debian-control  
Copyright 2019 Patrick Meade.  

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
