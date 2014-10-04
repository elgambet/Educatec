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
 
        var buscar = function(texto, place, segmento){
            for(var tipo in API_METHODS.recursos){
                var titulo = tipo;
                console.log('Buscando (' + tipo + ')');
                $.getJSON(API_METHODS.recursos[tipo] + KEY + '&texto=' + texto, createCallback(titulo, segmento, place));    
            }            
        };
        
        $('#buscar').on('click', function() {            
            $('#descripcion-sitio').hide();
            $('#contenedor-resultados').show();
            var texto_busqueda = $('#texto-busqueda').val();
            $('#busqueda-resultados').empty();
            buscar(texto_busqueda, 'busqueda-resultados', false);
        });
        
        $('#menu-busquedas a').on('click', function() {
            var id = $(this).attr('id');
            if(id == 'principal'){
                $('#descripcion-sitio').show();
                $('#contenedor-resultados').hide();
                $('#busqueda-resultados').empty();
            } else {
                $('#descripcion-sitio').hide();
                $('#contenedor-resultados').show();
                var texto_busqueda = id.split("-");
                $('#busqueda-resultados').empty();
                buscar(texto_busqueda[1], 'busqueda-resultados', false);
            }
        });        
    }   
);