<p align='center'>
<br><img src='https://user-images.githubusercontent.com/74385/46930533-c84de080-d078-11e8-8b8a-24945201be94.png' width='192'><br>
</p>

<h1 align='center'>rehype-decorate</h1>

<p align='center'>
<em>Add custom class names to remark</em>
</p>

<br>

I'll explain later, but this is pretty cool.

```md
# This is markdown

<!-- {.large-heading} -->

The `h1` above will have a CSS class name `large-heading` applied to it. We do
this without extending Markdown syntax. The HTML comment will be invisible
where regular Markdown parsers can't see it, making your Markdown render just
as normal Markdown.

Cool, isn't it?
```
