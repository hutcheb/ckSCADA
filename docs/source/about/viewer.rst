.. ckSCADA Viewer

Viewer Overview
===================================

ckViewer is the operators interface to the running ckSCADA system. It is based
around an embedded web browser. This allows for the flexibility of using open
web standards to display infomation to the operator such as HTML5 and SVG. It
also allows animation frameworks to be used such as Anime.

During development inkscape has been used to develop SVG graphics. This seems
to work well as it provides a professional drawing package which is very flexible.
There are some attributes and elements such as the cktag, ckparameter and ckscript
classes that are required to be added manually so that ckSCADA points can be
shown on the screen. This can be done within the inkscape xml editor window.

When a page is loaded the viewer will first search for any <image> elements which
also have a class attribute of **ckobject**. It will then use **name** attribute
and replace all references of **$Object** within a copy of the linked file
with the object in the **name** attribute. This copy then gets embedded within
the page so the external file doesn't need to be read each time the tag is updated.

.. code-block:: html

  <image width="50px" height="50px" x="100px" y="100px" class="ckobject" xlink:href="svg/Motor.svg" object="Simulated.Flow.Transmitter"/>

It will then search for elements with the **cktag** attribute and create a list
of tags that are used on the screen. It will then subsribe to the Kafka topics
for each tag.

.. code-block:: html

  <text class="cktag" name="Simulated.Flow.Transmitter.Scaled!eu" style="fill: 'black'; font-family: &quot;Roboto Slab&quot;; font-size: 12px; white-space: pre;" x="420" y="300"><title>Test</title>####</text>

When a message is recieved on one of these topics, the elements associated with
that topic are updated. When using the ckatg class attirbute the text content of
that element is updated with the new value.

When specifying the cktag class the **name** attribute specifies the tag. The tag
is a combination of the Kafka topic name and the attribute from recieved message.
such as **Simulated.Flow.Transmitter.Raw!value** when **Simulated.Flow.Transmitter.Raw**
is the topic and **value** is the attribute. This allows for several attributes to
be sent within the same message.

The **ckscript** element can also be used to include script behaviour which is run
when the included **ckparameter** topics are updated.

.. todo::
  Add the ability to include multiple ckparameter element per script.

.. code-block:: html

  <text class="cktag" name="Simulated.Flow.Transmitter.Stored!value" style="fill: 'black'; font-family: &quot;Roboto Slab&quot;; font-size: 12px; white-space: pre;" x="500" y="300">
      <title>Test</title>
      <g class="ckparameter">Simulated.Flow.Transmitter.Raw!value</g>
      <g class="ckscript">if (this.v &gt; 50) {
              this.e.style.fill = "red";
            } else {
              this.e.style.fill = "green";
            };
            </g>
      ####
  </text>

This allows for updating specific attrbutes of the element when tags are updated
such as background colour, position, etc..

As these scripts are run on every update of the tag these scripts should be kept
as short as possible with the tag update rate being taken into account. If the
tag is updated every 10ms then is doesn't leave much time for the script to run.
If it is updated every 1-2 seconds the script can be made longer.
