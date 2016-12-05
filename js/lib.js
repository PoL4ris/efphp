var execute = new function(){

    this.run = function(){

        var seccion = "home";

        if(utils.getParameterByName("s")){
            seccion = utils.getParameterByName("s");
        }

        vistas.global();

        try{
            var res = seccion.replace("-", "_");
            res = res.replace("-", "_");
            eval("vistas." + res + "()");

        }catch(err){

            console.log(err);
        }


    };

};

var validator = {

    startValidations : function(){

        $('.validation-form').submit(function(e){

            e.preventDefault();

            var validated = true;

            $(this).find('input').each(function(){
                try{
                    if(!validator.validateInput($(this).attr('class'),$(this).val(),$(this))){
                        validated = false;
                    }
                }catch(err){
                    console.log(err);
                }
            });

            if(validated){
                $(this).unbind().submit();
            }else{
                $("<div class='message-validation'>Valida todos los datos requeridos</div>").dialog({"modal" : true});
            }


        });

    },

    validateInput : function(type, val, selector){

        type = type.split(" ");
        var valid = true;
        for(var i = 0; i < type.length; i++){

            var tmp = type[i];
            tmp = tmp.split('validation-');

            if(tmp.length > 1){

                if(!validator.validator(tmp[1],val, selector)){
                    valid = false;

                }
            }
        }

        return valid;

    },

    validator : function(type, val, selector){

        var validated = true;

        switch(type){

            case "tel":
                var patt = new RegExp("^[1-9]{10}$");
                var telefono = val;
                if (!patt.test(telefono)){
                    validated = false;
                }
                break;

            default:
                if(typeof val === "undefined" || val == "" ){
                    validated = false;
                }

                break;
        }

        if(!validated){
            validator.changeColor(selector,"error");
        }else{
            validator.changeColor(selector,"regular");
        }

        return validated;

    },

    changeColor : function(selector, type){


        switch(type){

            case "error":
                $(selector).css({"color":"#cc0000"});
                $(selector).parent().parent().find('.input').find('.form-control').css({"border":"1px solid #cc0000"});
                break;
            case "regular":
                $(selector).css({"color":"inherit"});
                $(selector).parent().parent().find('.input').css({"color":"inherit"});

                break;

        }


    }

};

var utils = {

  getParameterByName: function(name){

        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

    },

  createTable: function(selector, objects, data, column){

        console.log(data.length);

        try{
            var table = "<table id='rand'>";

            var headFoot = "";

            for(var i = 0; i < column.length; i++){

                headFoot+="<th>" + column[i] + "</th>";

            }

            table+= "<thead><tr>" + headFoot + "</tr></thead>";
            table+= "<tfoot><tr>" + headFoot + "</tr></tfoot>";

            var body = "";

            for(var i = 0; i < data.length; i++){

                body+= "<tr>";

                for(var j = 0; j < objects.length; j++){


                    body+= "<td>" + data[i][j][objects[j]] + "</td>";

                }

                body+= "</tr>";
            }

            table += body;
            table += "</table>";
            $(selector).append(table);


            $("#rand").DataTable();
            return true;

        }catch(err){

            console.log(err);

        }



    },

  dynamicBuildingContent: function(type){

        ajaxData('lib/Execute.php?e=Mhmproperties/getBuildingByType/' + type,'GET',{},'true',function(json) {
            console.log(json);

            //LI Filter Json.roomsFilter
            var filter = json.roomfilter;
            var filterLi = '<li><a class="btn btn-default active" href="#" data-filter="*">All</a></li>';
            var filterInicio = '<li><a class="btn btn-default" href="#"';
            var filterFin = '</a></li>';

            for (var obj in filter)
            {
                var splitResult = filter[obj].split('/');
                var resultParse = splitResult[0] + (splitResult[1]?splitResult[1]:'');
                var filterUnion = filterInicio + 'data-filter=".' + resultParse + '">' + resultParse + filterFin;
                filterLi += filterUnion;
            }
            $('#prop-filter-list').html(filterLi);
            //END LI Filter Json.roomsFilter

            var contentHtml = '';
            for(var obj in json)
            {
                if(obj == 'roomfilter')
                    continue;

                var shortVar = json[obj];
                var filterAttrClass = '';
                var content = '';
                var roomsData     = '';
                var rooms         = shortVar['rooms'];

                content += '<div class="single-service">';
                content += '<div class="wow scaleIn feautured-box-container" data-wow-duration="500ms" data-wow-delay="300ms">';
                if(shortVar['fromfee'] == 'LEASED')
                  content   += '<div class="p-red-card p-leased">' + '<p><label for="">' + shortVar['fromfee'] + '</label></p>' + '</div>';
                else if(shortVar['fromfee'] || shortVar['fromfee'] > 0)
                    content   += '<div class="p-red-card">' + '<p>From $ <label for="">' + shortVar['fromfee'] + '</label>/person</p>' + '</div>';

                content += '<img src="' + shortVar['img_building'] + '"  alt="' + shortVar['seoalt'] + '" title="'+ shortVar['seotitle'] +'">';
                content += '</div>';

                content += '<div class="v1-property-card-info">';
                content += '<p class="v1-p-type">';
                content += shortVar['buildingtype'] + ' FOR RENT';
                content += '</p>';
                content += '<p class="v1-p-address">';
                content += '<i class="fa fa-location-arrow"></i>';
                content += '<span class="v1-p-a-street">';
                content += shortVar['nombre'];
                content += '</span>';
                content += '</p>';
                content += '<p class="v1-p-data">';

                if(rooms.length > 0 )
                {
                    for (var index in rooms)
                    {

                        var splitResult = rooms[index]['nombre'].split('/');
                        var resultParse = splitResult[0] + (splitResult[1]?splitResult[1]:' ');
                        filterAttrClass += ' ' + resultParse;

                        roomsData += '<label>';
                        roomsData += rooms[index]['nombre'];
                        roomsData += ': $';
                        roomsData += rooms[index]['pricefrom'];
                        if(rooms[index]['priceto'])
                            roomsData += ' - $';
                        roomsData += rooms[index]['priceto'];
                        roomsData += '</label>';
                    }
                    content += roomsData;
                }

                console.log(filterAttrClass);

                content += '</p>';
                content += '</div>';
                content += '</div>';

                contentHtml += '<a href="?s=propertydetail&p=' + shortVar.id + '">';
                contentHtml += '<div class="col-sm-4 portfolio-item  ' + filterAttrClass + '"data-wow-duration="1000ms" data-wow-delay="300ms">';
                contentHtml += content;
                contentHtml += '</div>';
                contentHtml += '</a>';

            }

            $('#prop-list-container').html(contentHtml);

        });
        $('#prop-list-container').fadeIn('slow');

        },

  gmapFunction : function (propertyObject){

    var addresses = [
       '101 S Busey Ave Champaign, IL'
       ,'102 S Lincoln Avenue  Champaign, IL'
       ,'605 E Clark Street  Champaign, IL'
       ,'606 E White  Champaign, IL'
       ,'205 S Sixth Street  Champaign, IL'
       ,'303 S Fifth Street  Champaign IL'
       ,'203 S Fourth Street C  Champaign, IL'
       ,'311 E Clark Street  Champaign, IL'
       ,'314 E Clark Street  Champaign, IL'
       ,'808 S Oak Street  Champaign, IL'
       ,'803 S Locust Street  Champaign, IL'
       ,'805 S Locust  Champaign, IL'
       ,'61 E John Street  Champaign, IL'
       ,'803 S First Street  Champaigne, IL'
       ,'101 E Daniel  Champaign, IL'
       ,'101 E Armory Street  Champaign, IL'
       ,'1711-B Harrington Drive  Champaign, IL'
       ,'1711-A Harrington Drive  Champaign, IL'
     ];
    if( $('#gmap').length ) {
      var map;

    GMaps.geocode({
       address: propertyObject ? propertyObject[0].nombre :'303 S Fifth Street Champaign, IL 61820',
       callback: function(results, status) {
         if (status == 'OK') {
           var latlng = results[0].geometry.location;
           map.setCenter(latlng.lat(), latlng.lng());
           map.addMarker({
             lat: latlng.lat(),
             lng: latlng.lng(),
             animation: google.maps.Animation.DROP,
             infoWindow: {
               content: propertyObject ? propertyObject[0].nombre :'<p>HTML Content</p>'
             }
           });
         }
       }
     });
    function setMarkers(address){
     GMaps.geocode({
       address: address,
       callback: function(results, status) {
         if (status == 'OK') {
           var latlng = results[0].geometry.location;
           map.addMarker({
             lat:  latlng.lat(),
             lng:  latlng.lng(),
             animation: google.maps.Animation.DROP,
             infoWindow: {
               content: '<p>'+address+'</p>'
             }
           });
         }
       }
     });
    }

    if(propertyObject)
     setMarkers(propertyObject[0].address)
    else
      for(var obj in addresses)
        setMarkers(addresses[obj]);

    map = new GMaps({
       div: '#gmap',
       lat: '41.869795',
       lng: '-87.62637799999999',
       scrollwheel:false,
       zoom: 14,
       zoomControl : true,
       panControl : false,
       streetViewControl : true,
       mapTypeControl: false,
       overviewMapControl: false,
       clickable: true,

     });

    }

   },

   homeFullProperties : function (object){

     var html = '';
     for(var index in object){
       var obj = object[index];
       if(index == 'roomfilter')
         continue;

       html += '<div class="row fullp '+ obj.buildingtype +' portfolio-item ">';
       html += '<a href="?s=propertydetail&p='+ obj.id +'">';
       html += '<div class="col-xs-3 fullp-3">';
       html += '<div class="table-cell-fix">';
       html += '<img src="'+ obj.img_building +'" alt="'+ obj.buildingtype +'" title="'+ obj.buildingtype +'">';
       html += '</div>';
       html += '</div>';
       html += '<div class="col-xs-9  fullp-9">';
       html += '<div class="fullp-name">'+ obj.nombre +'</div>';
       html += '<div class="fullp-desc">'+ obj.cms_description +'</div>';
       html += '<div class="fullp-type">'+ obj.buildingtype +'</div>';
       if(obj.fromfee == 'LEASED')
        html += '<div class="fullp-from p-leased">'+ obj.fromfee +'</div>';
       else
        html += '<div class="fullp-from"> From $'+ obj.fromfee +'</div>';
       html += '</div>';
       html += '</a>';
       html += '</div>';
     }

     return html;
   }

}


