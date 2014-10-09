$(document).ready(
    function()
    {
        var template = $('#template').html();
        Mustache.parse(template);
        
        var API_DOMAIN = 'https://api.educ.ar/0.9/';
        var API_METHODS = {
            'recursos': {
                'Juegos': API_DOMAIN + 'recursos/juegos/',
                'Videos': API_DOMAIN + 'recursos/videos/',
                'Ebooks': API_DOMAIN + 'recursos/ebooks/',
                'Secuencias': API_DOMAIN + 'recursos/secuencias/',
                'Infografias': API_DOMAIN + 'recursos/infografias/'
            }
        };
        var KEY = '?key=808509ff7e847aabbb73c4396fbaabe6010cfdd0';
        
        function createCallback(titulo, segmento, place) {
            return function(response) {
                console.log(response);
                var total = response.result.data.length;
                if(total > 0){                    
                    template, response.result.titulo_html = titulo;
                    template, response.result.titulo_segmento = segmento ? 'Búsqueda de: ' + segmento : false;
                    var rendered = Mustache.render(template, response.result);
                    $('#' + place).append(rendered);
                } else {
                    $('#' + place).empty('<p>No hay resultados</p>');
                }
            };
        }
 
        var buscar = function(texto, place, source, segmento){
            var methods = source == false ? [] : source;
            var methods_length = methods.length;
            for(var tipo in API_METHODS.recursos){
                if (methods_length == 0 || $.inArray(tipo, methods) !== -1 ){
                    var titulo = tipo;
                    console.log('Buscando (' + tipo + ')');
                    $.getJSON(API_METHODS.recursos[tipo] + KEY + '&texto=' + texto, createCallback(titulo, segmento, place));    
                }
                
            }            
        };
        
        var hide = function(element){
            var element_hide = $('#' + element.attr('data-hide'));
            if(typeof element_hide !== 'undefined'){
                element_hide.hide();
            }
        }

        var show = function(element){
            var element_show = $('#' + element.attr('data-show'));
            if(typeof element_show !== 'undefined'){
                element_show.show();
            }
        }

        var getRenderElement = function(element){
            var append = element.attr('data-append');
            if(typeof append !== 'undefined'){
                return append;
            } else {
                var html = element.attr('data-html');
                if(typeof html !== 'undefined'){
                    $("#" + html).empty();
                    return html;
                } 
            }

            return false;
        }

        var getDataSource = function(element){
            var source = element.attr('data-source');
            if(typeof source !== 'undefined'){
                return source.split(",");
            }

            return false;
        }

        $('[data-buscar-id]').on('click', function() {
            buscar($('#' + $(this).attr('data-buscar-id')).val(), getRenderElement($(this)), getDataSource($(this)), false);                    
        });
        
        $('[data-buscar]').on('click', function() {
            buscar($(this).attr('data-buscar'), getRenderElement($(this)), getDataSource($(this)), false);
        });

        $('[data-hide]').on('click', function() {
            hide($(this));
        }); 

        $('[data-show]').on('click', function() {
            show($(this));
        });        
    }   
);