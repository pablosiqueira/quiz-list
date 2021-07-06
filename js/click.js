var quizes = { 
    1:{
        name: 'Matemática',
        dates: {
            start:{
                day: 23,
                month: 02,
                year: 2021
            },
            end: {
                day: 31,
                month: 12,
                year: 2021
            }
        },
        status: 'Rascunho',
        questions:{
            1:{
                question:'2 + 2',
                answers: {
                    1: {content: 5 , correct: false},
                    2: {content: 10 , correct: false},
                    3: {content: 4 , correct: true},
                    4: {content: 3 , correct: false}
                },
                status: 'Postada'
            },
            2:{
                question:'7 * 7',
                answers: {
                    1: {content: 33 , correct: false},
                    2: {content: 14 , correct: false},
                    3: {content: 10 , correct: false},
                    4: {content: 49 , correct: true}
                },
                status: 'Postada'
            }
        },
    },
    2:{
        name: 'Filmes',
        dates: {
            start:{
                day: 12,
                month: 07,
                year: 2020
            },
            end: {
                day: 15,
                month: 10,
                year: 2021
            }
        },
        status: 'Publicado',
        questions: {
            1:{
                question:'Qual o filme coreano vencedor de quatro oscars ?',
                answers: {
                    1: {content: 'Oldboy', correct: false},
                    2: {content: 'Parasita', correct: true},
                    3: {content: 'Novo Mundo', correct: false},
                    4: {content: 'Náufrago na Lua', correct: false}
                },
                status: 'Postada'
            },
        },
        
    },
}

console.log(quizes)
initTable()

function initTable(){   //Fill the quiz table in the first load
    var quizes_size = Object.keys(quizes).length
    for(var i = 1; i < quizes_size + 1; i++){
        var quiz_name = quizes[i].name
        var quiz_quant = Object.keys(quizes[i].questions).length
        add(i,quiz_name,quiz_quant)
    }
}

function generateQuizModal(mode,id){ //clean modal to show the selected data
    $("#question-table-body").empty()
    $('#alert-msg-name').html('')
    if (mode == 'add'){ 
        console.log('new quiz')    
        var quizes_init_size = Object.keys(quizes).length + 1
        $("#input-desc").html("Id-" + quizes_init_size)
        $("#input-quiz-name").val('')
        $("#input-begin").val('')
        $("#input-end").val('')
       // var quiz_name = $("input-quiz-name").val()
    }else if(mode == 'edit'){  
        $("#input-desc").html("Id-" + id)
        $("#input-quiz-name").val(quizes[id].name)
        var dates = quizes[id].dates   
        $("#input-begin").val(dates.start.year + '-' + addZero(dates.start.month) + '-' + addZero(dates.start.day))
        $("#input-end").val(dates.end.year + '-' + addZero(dates.end.month) + '-' + addZero(dates.end.day))
        generateQuestTable(id)
    }
}

function addZero(n){ //add a 0 to day or month if the length is 1
    var num = n
    if(n.toString().length == 1){
        num = '0' + n.toString()
    }
    return num
}

function generateQuestTable(id){
    var qst_size = Object.keys(quizes[id].questions).length
    for(var i = 1; i < qst_size + 1; i++){
        if(quizes[id].questions[i].status != "Excluida"){
            console.log(quizes[id].questions[i].status)
            adToQuestionTable(i)
        }
    }
}

function getId(element){
    var id = $(element).html().split('-')
    id = id[1]
    return id
}

function getQuestSize(id){ //get number of questions
    var size = Object.keys(quizes[id].questions).length
    var quest_count = 0 
    for(var i = 1; i < size + 1; i++){
        if(quizes[id].questions[i].status == 'Postada'){
            quest_count++
        }
    }
    return quest_count
}

function createEdit(){
    var id = getId("#input-desc") //get Id
    var data = getNameandDate() //get name and date fields
    var exists = checkQuizExists() //check if quiz exists
    var nullFields = checkNameDateNull() //check if fields are filled
    if(nullFields){
        alertMsg('#alert-msg-name','text-success','text-danger','Por favor, preencher nome e datas de vigência.')
    }else{
        if(exists){ // if the quiz already exists the function will edit it
            quizes[id].name = data[0]
            quizes[id].dates.start.year = data[1][0]
            quizes[id].dates.start.month = data[1][1]
            quizes[id].dates.start.day = data[1][2]
            quizes[id].dates.end.year = data[1][0]
            quizes[id].dates.end.month = data[1][1]
            quizes[id].dates.end.day = data[1][2]
            var questions_size = getQuestSize(id)
            editTable(id,data[0],questions_size) //edit table
            alertMsg('#alert-msg-name','text-danger','text-success','Quiz editado')
        }else{ // if the quiz doesn't exist the function will create it
            createQuiz(id,data) // create data
            add(id,data[0],0) // add to table
            quizes[id] 
            console.log(quizes[id])
            alertMsg('#alert-msg-name','text-danger','text-success','Quiz criado')
        }   
    }
}

function createQuiz(id,data){
    quizes[id] = { name: data[0] , dates: {start: {day: data[1][2], month: data[1][1], year: data[1][0]}, 
    end: {day: data[2][2], month: data[2][1], year: data[2][0]}}, status: 'Rascunho' ,questions: {}}
}

function add(id,name,qnt){ //add quiz to the table
    $("#quiz-body").append("<tr id=quiz-" + id + " class='text-center pt-3'></tr>");
    $("#quiz-" + id).append("<th scope='row' class='pt-3'>" + id + "</th>");
    $("#quiz-" + id).append("<td class='pt-3'>" + name + "</td><td class='pt-3'>" + qnt + "</td>");
    console.log('add')
    actions(id)
}

function editTable(id,name,qnt){ //edit table from home
    document.getElementById('quiz-' + id).children[1].textContent = name
    document.getElementById('quiz-' + id).children[2].textContent = qnt
}

function actions(id){ // details, edit and delete icons section in the quiz table
    $("#quiz-" + id).append("<td class='d-flex justify-content-evenly'></td>")
    $("#quiz-" + id + "> td").last().append("<a class='details-icon'><i class='bi bi-plus-square d-flex flex-column mx-1' data-bs-toggle='modal' data-bs-target='#details-modal' > Detalhes </i></a>")
    $("#quiz-" + id + "> td").last().append("<a class='add-icon'><i class='bi bi-pencil d-flex flex-column mx-1' data-bs-toggle='modal' data-bs-target='#quiz-modal' > Editar </i></a>")
    $("#quiz-" + id + "> td").last().append("<a class='del-icon'><i class='bi bi-trash d-flex flex-column mx-1'> Exluir </i></a>")
    $('#quiz-' + id +'> td:nth-child(4) > a:nth-child(1)').attr('onClick',"generateQuizDetails("+ id + ")") //open modal for details
    $('#quiz-' + id +'> td:nth-child(4) > a:nth-child(2)').attr('onClick',"generateQuizModal('edit',"+ id + ")") //open modal for editing
    $('#quiz-' + id +'> td:nth-child(4) > a:nth-child(3)').attr('onClick',"remove(" + id + ",'quiz-',0)") //remove
}

function generateQuizDetails(id){ //create the data for the details modal
    $('#details-modal-body').empty()
    var selected = quizes[id]
    $('#details-quiz').html('Quiz: '+ selected.name)
    var size = Object.keys(quizes[id].questions).length
    for(var i = 1; i < size + 1; i++){
        if(selected.questions[i].status == "Postada"){ //show only the posted question, hide the delete ones
            $('#details-modal-body').append("<div id='details-q" + i +"' class='d-block mx-auto mb-4'><h5 class='text-center'>Questão "+ i + 
            ": </h5><h5 class='text-center'>" + selected.questions[i].question +"</h5><ul class='list-group text-center' id='ans-list-group-"+ 
            i +"'>Respostas:</div>")
            var qst_size = Object.keys(quizes[id].questions[i].answers).length
            console.log('answers size ' + qst_size)
            for(var j = 1; j < qst_size + 1; j++){
                var answer = quizes[id].questions[i].answers[j]
                if(answer.correct == false){ //wrong answer
                    $('#ans-list-group-' + i).append("<li class='list-group-item'>" + answer.content +"</li>")
                }else{ //correct answer
                    $('#ans-list-group-' + i).append("<li class='list-group-item list-group-item-success'>" + answer.content +"</li>")
                }
            }
        }
    }   
}


function remove(id,mode,parentId){ // id = quiz-1 removing from list and updating status
    $('#' + mode + id).remove()
    //delete quizes[id]
    if(mode == 'quiz-'){
        quizes[id].status = 'Excluido'
    }else{
        //delete quizes[parentId].questions[id]
        quizes[parentId].questions[id].status = 'Excluida'
        var questions_size = getQuestSize(parentId)
        editTable(parentId,quizes[parentId].name,questions_size) //update quizes table
    }
}

function addQuestion(){ ///ok
    var id = getId("#input-desc")
    var checked = checkRadios() // check if a radio is marked
    var quiz_exists = checkQuizExists() // check if quiz already exists
    if(checked[0] > 0 && checked[1] == 0){
        if (quiz_exists){ //add to existing quiz 
            //alertMsg('#alert-msg','text-danger','text-success','Pergunta e respostas salvas.')
            newQuestion(id)
        }else{ //quiz doesn't exist, adding new quiz   
            var name_date_null = checkNameDateNull()
            if(name_date_null){ //if name or dates are null
                alertMsg('#alert-msg-name','text-success','text-danger','Por favor, preencher nome e datas de vigência.')
            }else{// creating new quiz and adding new question
                createEdit() // creating quiz
                newQuestion(id)
                alertMsg('#alert-msg-name','text-danger','text-success','Sucesso.')
                console.log(quizes)
            }
        }
        var questions_size = getQuestSize(id)
        editTable(id,quizes[id].name,questions_size) //update quizes table

    }else{
        //ask to mark and/or fill fields
        console.log('error')
        alertMsg('#alert-msg','text-success','text-danger','Por favor preencha todos os campos e/ou marque a resposta correta.')
    }
}

function checkRadios(){ //see if a radio is checked
    var group_size = $('#answers-group').children().length
    var checked = 0
    var check_text = [0,0]
    for(var i = 1; i < group_size+1; i++){
        var is_check = $('#questRadio' + i).is(':checked')
        var text_check = $('#textQst' + i).val()
        //see if text is null
        if (is_check){
            checked = i
            check_text[0] = i
        }
        if (text_check == ""){
            check_text[1] = 1
        }
    }
    return check_text
}

function checkQuizExists(){ //check if quiz exists
    var id = $("#input-desc").html().split('-')
    id = id[1]
    var exists = false
    if (quizes[id]){
        exists = true
    }
    return exists
}

function getNameandDate(){ //get name and dates from form
    var data = ['name','begin','end']
    data[0] = $('#input-quiz-name').val()
    data[1] = $('#input-begin').val().split('-')
    data[2] = $('#input-end').val().split('-')
    return data
}

function checkNameDateNull(){ //check if name and/or date is null
    var data = getNameandDate()
    var existsNull = false
    var exists_name = data.includes('')
    var exists_start = data[1].includes("")
    var exists_end = data[2].includes("")
    if(exists_name || exists_start || exists_end){
        existsNull = true
    }
    return existsNull
}

function alertMsg(id,remove,add,msg){ //edit the error or success message
    $(id).html(msg)
    $(id).removeClass(remove)
    $(id).addClass(add)
}

function newQuestion(id){
    var questions_size = Object.keys(quizes[id].questions).length
    quizes[id].questions[questions_size + 1] = {
        question : $('#questionInput').val(),
        answers : {},
        status : 'Postada'
    }
    quizes[id].status = 'Publicado'
    var answers_size = $('#answers-group').children().length
    console.log('answers size: ' + answers_size)
    for (var i = 1; i < answers_size + 1; i++){
        var ans = $('#textQst' + i).val()
        var checked = $('#questRadio' + i).is(':checked')
        quizes[id].questions[questions_size + 1].answers[i] = {content: ans, correct: checked}
    }
    adToQuestionTable(questions_size + 1)
    alertMsg('#alert-msg-name','text-danger','text-success','')
    
}

function adToQuestionTable(qstId){ //add question data to question table
    $('#question-table-body').append("<tr id=question-" + qstId + " class='text-center'></tr>")
    $('#question-' + qstId).append("<th scope='row'>" + qstId + "</th>")
    var quiz_id = getId("#input-desc")
    var answers_size = Object.keys(quizes[quiz_id].questions[qstId].answers).length
    $('#question-' + qstId).append("<td>" + quizes[quiz_id].questions[qstId].question + "</td><td>" + answers_size + "</td>")
    $('#question-' + qstId).append("<td class='d-flex justify-content-evenly'></td>")
    $("#question-" + qstId + "> td").last().append("<a class='add-icon'><i class='bi bi-pencil d-flex flex-column' id='edit-qst-"+ qstId +"'> Editar</i></a>")
    $("#question-" + qstId + "> td").last().append("<a class='add-icon'><i class='bi bi-trash d-flex flex-column' id='exclude-qst-"+ qstId +"'> Exluir</i></a>")
    $('#edit-qst-' + qstId).attr('onClick',"editQuestion(" + qstId + "," + quiz_id +")")
    $('#exclude-qst-' + qstId).attr('onClick',"remove(" + qstId + ",'question-'," + quiz_id +")")
    clearQuestion() // cleaning question fields
    $('#questions-div').addClass('d-none'); //hiding question form
}


function clearQuestion(){ //clean question fields
    $('#questionInput').val('')
    var answers_size = $('#answers-group').children().length
    for(var i = 0; i < answers_size; i++){
        var q_id = i + 1
        $('#textQst' + q_id).val('')
        $('#questRadio' + q_id).prop('checked',false)
        if (i + 1 > 2){ //
            removeRadioInput()
        }
    }
}

function addRadioInput(){ //add input for answers
    var group_size = $('#answers-group').children().length + 1
    var div_id = 'div-ans-' + group_size
    $("#answers-group").append("<div class='input-group mb-2' id='" + div_id + "'></div>")
    var id = 'questRadio' + group_size
    $('#' + div_id).append("<div class='input-group-text'><input class='form-check-input mt-0' type='radio' name='questRadio' id="
    + id + "></div>")
    var id_text = 'textQst'+ group_size
    $('#' + div_id).append("<input type='text' class='form-control' id=" + id_text + "></input>")
    $('#remove-ans-button').prop('disabled',false)
}

function removeRadioInput(){ //remove answer input - there must be two at least
    var size = $('#answers-group').children().length
    if(size > 2){
        $('#div-ans-' + size).remove()
    }
    if (size == 3){
        $('#remove-ans-button').prop('disabled',true)
    }
}

function showQuestion(){ //show question form
   $('#questions-div').removeClass('d-none')
   var quiz_Id = getId("#input-desc")
   if(quizes[quiz_Id]){
    var new_qst_id = Object.keys(quizes[quiz_Id].questions).length + 1
    $("#quest-id").html("Id-" + new_qst_id)
   }else{
    $("#quest-id").html("Id-1")
   }
    
}

function editQuestion(qstId,quizId){ //show the question and answers in the form
    showQuestion()
    clearQuestion()
    var qst_and_ans = quizes[quizId].questions[qstId]
    $('#questionInput').val(qst_and_ans.question) // fill question field
    var ans_size = Object.keys(qst_and_ans.answers).length
    if (ans_size > 2){ // if there are more than 2 answers, add more fields
        var dif = ans_size - 2
        for(var i = 0; i < dif; i++){
            addRadioInput()
        }
    }
    var answers = qst_and_ans.answers
    for (var i = 0; i < ans_size;i++){
        var order = i + 1
        $('#textQst' + order).val(answers[order].content)
        if(answers[order].correct == true){
            $('#questRadio' + order).prop('checked',true)
        }
    }
    $('#btn-qst-save').addClass('d-none')
    $('#btn-qst-edit').removeClass('d-none')
    $("#quest-id").html("Id-" + qstId)
}

function changeQuestion(){ //edit question and answers
    var quiz_id = getId("#input-desc")
    var qst_id = getId("#quest-id")
    var qst_name = $('#questionInput').val()
    quizes[quiz_id].questions[qst_id] = {
        question : $('#questionInput').val(),
        answers : {},
        status : 'Postada'
    }
    var answers_size = $('#answers-group').children().length
    for (var i = 1; i < answers_size + 1; i++){
        var ans = $('#textQst' + i).val()
        var checked = $('#questRadio' + i).is(':checked')
        quizes[quiz_id].questions[qst_id].answers[i] = {content: ans, correct: checked}
    }
    alertMsg('#alert-msg-name','text-danger','text-success','')
    var el = '#question-'
    editqstTable(qst_id,qst_name,answers_size,el)
}

function editqstTable(qst_id,name,size,element){
    $(element + qst_id +'> td:nth-child(2)').html(name)
    $(element + qst_id +'> td:nth-child(3)').html(size)
    if(element == '#question-'){
        clearQuestion()
        $('#btn-qst-save').addClass('d-none')
    } 
}

