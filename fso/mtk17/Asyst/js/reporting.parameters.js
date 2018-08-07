$(document).ready(function () {

    //Asyst.zimbar.appendTopPanelHtml();

    $('.report-container').css({
        'marginTop': $('.parameters').height() - $('#ReportViewer1_ctl05').height(),
        'height': $(window).height() - $('.parameters').height(),
        'width': '100%'
    })

    // выравнивание высоты отчета в случае ресайзе окна
    $(window).resize(function () {
        //var parametersHeight = $('.parameters').height()
        //$('.report-container').css({ 'marginTop': $('.parameters').height(), 'height': $(window).height() - $('.parameters').height() });
        $('.report-container').css({
            'marginTop': $('.parameters').height() + $('.parameters').offset().top + $('#ReportViewer1_ctl05').height(),
            'height': $(window).height() - $('.parameters').height() - $('.parameters').offset().top - $('#ReportViewer1_ctl05').height()
        });
        $('#ReportViewer1_ctl05').css({
            'position': 'fixed',
            'top': $('.parameters').height() + $('.parameters').offset().top,
            'left': 0, 'zIndex': 100, 'width': '100%'
        });
    });

    // Скрытие-раскрытие формы с параметрами
    $('.parameters-toggle').on('click', function () {
        $('.parameters .parameters-form:not(.active)').slideToggle(10,
            function () {
                $('.report-container').css({
                    'marginTop': $('.parameters-toggle').height() + $('.parameters-toggle').offset().top + $('#ReportViewer1_ctl05').height(),
                    'height': $(window).height() - $('.parameters-toggle').height() - $('.parameters-toggle').offset().top - $('#ReportViewer1_ctl05').height()
                })
                $('.parameters-toggle-in').html('&#9660;');
                $(this).addClass('active');
                //$('#ReportViewer1_ctl09').css({'overflow':'inherit'})
                $('#ReportViewer1_ctl09').css({ 'height': $('.report-container').height() });
                $('#ReportViewer1_ctl05').css({
                    'position': 'fixed',
                    'top': $('.parameters').height() + $('.parameters').offset().top,
                    'left': 0, 'zIndex': 100, 'width': '100%'
                });
            }
        );
        $('.parameters .parameters-form.active').slideToggle(10,
            function () {
                $('.report-container').css({
                    'marginTop': $('.parameters').height() + $('.parameters').offset().top + $('#ReportViewer1_ctl05').height(),
                    'height': $(window).height() - $('.parameters').height() - $('.parameters').offset().top - $('#ReportViewer1_ctl05').height()
                })
                $('.parameters-toggle-in').html('&#9650;')
                $(this).removeClass('active')
                $('#ReportViewer1_ctl09').css({ 'height': $('.report-container').height() });
                $('#ReportViewer1_ctl05').css({
                    'position': 'fixed',
                    'top': $('.parameters').height() + $('.parameters').offset().top,
                    'left': 0, 'zIndex': 100, 'width': '100%'
                });
            }
        );
    });
});

$(window).load(function () {
    $('.report-container').css({
        'marginTop': $('.parameters').height() + $('.parameters').offset().top + $('#ReportViewer1_ctl05').height(),
        'height': $(window).height() - $('.parameters').height() - $('.parameters').offset().top - $('#ReportViewer1_ctl05').height()
    });
    $("[name='ReportViewer1$ctl05$ctl05$ctl00$ctl00$ctl00']").trigger("click");
    $('#ReportViewer1_ctl05').css({
        'position': 'fixed',
        'top': $('.parameters').height() + $('.parameters').offset().top,
        'left': 0, 'zIndex': 100, 'width': '100%'
    });

    // rezise not hide multiselect window
    $('.ms-drop').on('click mouseleave', function (e) {
        e.stopPropagation();
        var $elem = $(this)
        $elem.find('ul').css({ 'maxHeight': $elem.height() - 43 });
    });

    $('[data-autoupdate]').on('change', function () {
        $("[data-autoupdate]").multipleSelect("disable");
        $("#update").attr("disabled", "disabled").css({ "background-color": "#333", "opacity": 0.5, "cursor": "default" });
        $('form').append('<input name="update" value="update" type="hidden"/>').submit();
    });

    Sys.Application.add_load(function () {
        $find("ReportViewer1").add_propertyChanged(viewerPropertyChanged);
    });

    function viewerPropertyChanged(sender, e) {
        if (e.get_propertyName() == "isLoading") {
            if ($find("ReportViewer1").get_isLoading()) {
                // Do something when loading starts
                //console.log('start');
            }
            else {
                // Do something when loading stops
                $('.report-container').css({
                    'marginTop': $('.parameters').height() + $('.parameters').offset().top + $('#ReportViewer1_ctl05').height(),
                    'height': $(window).height() - $('.parameters').height() - $('.parameters').offset().top - $('#ReportViewer1_ctl05').height()
                });
                $('#ReportViewer1_ctl05').css({
                    'position': 'fixed',
                    'top': $('.parameters').height() + $('.parameters').offset().top,
                    'left': 0, 'zIndex': 100, 'width': '100%'
                });
            }
        }
    };
})
