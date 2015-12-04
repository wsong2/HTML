<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/Contents">
 <html>
 <head>
 <style>
table { border-collapse: collapse; }
table th { background: #F2FAF9; }
td.col1 { padding-right: 1em; font-style: italic; }
 </style>
 </head>
 <body>
 <table>
    <tr><th>Definition</th><th>Value</th></tr>
    <xsl:for-each select="Items/item"><tr>
        <td class='col1'><xsl:value-of select='@dfn'/></td><td><xsl:value-of select='.'/></td>
    </tr></xsl:for-each>
    <tr><th>Module</th><th>Name</th></tr>
    <xsl:for-each select="Modules/module"><tr>
        <td class='col1'><xsl:value-of select='@name'/></td><td><xsl:value-of select='description'/></td>
    </tr></xsl:for-each>
 </table>
 </body></html>
</xsl:template>
</xsl:stylesheet>
