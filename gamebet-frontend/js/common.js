$(document).ready(function() {
    $('body a.jqShowHide').closest('tr').next('tr').hide();
            $('body').on('click', 'a.jqShowHide', function(){
                if($(this).text()==='View') {
                    $(this).text('Hide')
                }
                else {
                    $(this).text('View')
                }
                $(this).closest('tr').next('tr').toggle()
            });


})