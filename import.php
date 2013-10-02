<!DOCTYPE html>
<html>
<head>
  <title></title>

    <script src="xml2json.js"></script>
    <script src="jquery-2.0.3.min.js"></script>

    <script>

        var x2js = new X2JS();

        $.ajax({
            type: "POST",
            url: "Data.xml",
            data: {},
            success: function(data){
                console.log(data);

                 var jsonObj = x2js.xml2json( data );
                 console.log(jsonObj);
            }
        });

    </script>

</head>
<body>

</body>
</html>