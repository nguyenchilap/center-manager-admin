$(document).ready(function(){
    const MAX_FIELD_TYPE = 3;

    const btnCreateLesson = document.querySelector('.btn-add-lesson');

    const formType = $('.form-group.input__type');

    const inputLessonName = document.querySelector('input[name = "name-lesson"]');
    const inputLessonDescript = document.querySelector('textarea[name = "description-lesson"]');
    const selectTypeLevel = document.querySelectorAll('.form-group.input__type > select');

    let countFieldType = selectTypeLevel.length;


    //Add Type
    $('.btn-add-field__type').click(function(){
        if (countFieldType < MAX_FIELD_TYPE){
            countFieldType += 1;
            formType.append(selectTypeLevel[0].outerHTML);
        }
    })

    //Create new Type
    $('.btn-add-field__type-create').click(function(){
        if (countFieldType < MAX_FIELD_TYPE){
            countFieldType += 1;
            formType.append(`<input name="type-new[]" class="form-control" placeholder="Enter Type Name (Example: JavaScript)">`);
        }
    })

    //Remove Type
    $('.btn-add-field__type-remove').click(function(){
        if(countFieldType > 0){
            countFieldType -=1;
            $('.form-group.input__type .form-control:last-child').remove();
        }
    })

    //Add new lesson
    btnCreateLesson.onclick = () => {
        if (inputLessonName.value === '' || inputLessonDescript.value === ''){
            alert('Điền đầy đủ thông tin bài học!!');
        }
        else{
            const tableLessonList = document.querySelector('.create__lesson-list tbody');
            let serialCounter = document.querySelector('.create__lesson-list tbody tr:last-child td:first-child');
            if (!serialCounter) serialCounter = 0;
            else serialCounter = serialCounter.innerHTML;
            tableLessonList.innerHTML += `
            <tr class="odd gradeX">
                <td>${Number(serialCounter) + 1}</td>
                <td><input type="text" style="width: 100%" name="lessonNames[]" value="${inputLessonName.value}"/></td>
                <td><input type="text" style="width: 364px" name="lessonDescripts[]" value="${inputLessonDescript.value}"/></td>
            </tr>
            `
        }
    }

    //Check Dropdown Input
    $('.btn-submit').click(function(e) {
        const selectInputs = document.querySelectorAll('select');
        for (let i = 0; i<selectInputs.length; i++){
            if (selectInputs[i].selectedIndex === 0) {
                e.preventDefault();
                alert('Chưa chọn dữ liệu!!!');
                break;
            }
        }
    })

    //Import Img
    $('input[name="img"]').change(function(event){
        $('.input__img').attr('src',URL.createObjectURL(event.target.files[0]));
    })

    //Allow only number
    $('input[name="price"]').keypress(function(evt){
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    })
})

