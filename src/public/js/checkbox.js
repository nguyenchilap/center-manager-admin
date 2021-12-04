$(document).ready(function(){
    //enable pagination table
    $('#dataTables-example').DataTable({
        responsive: true
    });

    const checkboxes = $('input[name="itemIds[]"]');
    const checkboxAll = $('input[name="checkBox-select-all"]');
    
    //check box all
    checkboxAll.change(function(){
        checkboxes.prop('checked', $(this).is(':checked'));
        renderBtnAction();
    })

    //check box
    checkboxes.change(function(e){
        let countBoxChecked = $('input[name="itemIds[]"]:checked');
        checkboxAll.prop('checked', checkboxes.length === countBoxChecked.length);
        renderBtnAction();
    })

    checkboxes.click(function(e){
        let countBoxChecked = $('input[name="itemIds[]"]:checked');
        e.stopPropagation();
    })

    //render button action
    renderBtnAction = () =>{
        if ($('input[name="itemIds[]"]:checked').length) $('.btn.btn-action').removeClass('disabled');
        else $('.btn.btn-action').addClass('disabled');
    }

    //submit btn action
    $('.list-actions li a').click(function(e){
        e.preventDefault();
        $('.input-action').attr('value',`${$(this).html()}`);
        $('.form-action').submit();
    })
})