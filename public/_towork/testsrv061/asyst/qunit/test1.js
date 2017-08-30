function isHidden(accessMatrixItem) {
    return accessMatrixItem.IsVisible == false;
}
function isReadonly(accessMatrixItem) {
    return accessMatrixItem.IsVisible == true && accessMatrixItem.IsReadonly == true;
}
function isWritable(accessMatrixItem) {
    return accessMatrixItem.IsVisible == true && accessMatrixItem.IsReadonly == false;
}


test("Access Matrix. Other role", function () {
    var data = Asyst.API.Form.load('PointEditForm', 82961);
    var samples = {
        Description: isReadonly,
        PlanDate: isWritable,
        ForecastDate: isWritable,
        PointType: isHidden,
        Owner: isWritable,
        Informed: isReadonly,
        WorkGroup: isHidden,
        OrgUnit: isHidden
    };
    QUnit.ok(typeof data != 'undefined', 'data loaded');
    QUnit.ok(data.hasOwnProperty('__access__'), 'access matrix loaded');    
    for (var c in samples) {
        QUnit.ok(samples[c].call(null,data.__access__[c]), c + ' ' + samples[c].name);
    }
});
;

/*test("test Asyst.API.getCurrentUser()", function () {
    QUnit.ok(typeof window.userAccount == 'undefined', 'userAccount is undefined');
    QUnit.ok(typeof window.userId == 'undefined', 'userId is undefined');
    Asyst.API.getCurrentUser();
    QUnit.ok(typeof window.userAccount != 'undefined', 'userAccount defined after call');
    QUnit.ok(typeof window.userId != 'undefined', 'userId defined after call');
});

var documentData = { EntityId: "a1fc47d2-2d97-42a8-8a60-93998c68f6f3", Name: "Новый документ совещания", Position: 12 };
var programData = JSON.parse('{"EntityId": "f1b10876-65de-49f0-848b-61919fef62b5", "OwnerId":[100060],"LeaderId":[100060],"OtherMembers":null,"Name":"Программа автотеста","Description":"Программа системы автоматического тестирования","OrgUnitId":5,"ActivityPhaseId":10002,"ActivityGoal":[1,6]}');
var pointData = JSON.parse('{"OwnerId":[100060],"LeaderId":[100060],"PointTemplateId":10003,"PlanDate":"2013-11-17T00:00:00.000Z","FactDate":"2013-11-15T00:00:00.000Z","ForecastDate":"2013-11-17T00:00:00.000Z","PointTypeId":1,"Name":"Веха-0. Ворота этапа \\"Инициация\\" пройдены","EntityId":"71dcb2f7-a542-4909-b4f4-3dcaf2b3b14c","ActivityPhaseId":10019}');

test("test Asyst.API.Entity", function () {
    //сохраняем документ
    var res = Asyst.API.Entity.save('Document', 'new', documentData);
    QUnit.ok(typeof res != 'undefined' && typeof res.id != 'undefined', 'Document saved');
    //проверяем, что свежезагруженное совпадает с тем, что пытались сохранить
    var loadData = Asyst.API.Entity.load('Document', res.id);
    var sameFlag = true;
    for (var c in documentData) {
        if (documentData.hasOwnProperty(c)) {
            if (!loadData.hasOwnProperty(c) || loadData[c] !== documentData[c])
                sameFlag = false;
        }
    }
    QUnit.ok(sameFlag, 'Loaded Document same as saved');
    if (!sameFlag) {
        QUnit.ok(false, 'data: ' + JSON.stringify(data) + '\r\n loadData: ' + JSON.stringify(loadData));
    }

    //удаляем
    var removed = Asyst.API.Entity.remove('Document', res.id);
    QUnit.ok(removed, "Document has been deleted");

});


test("test Asyst.API.Form and Asyst.API.Phases", function () {
    
    //создаем программу
    
    var program = Asyst.API.Form.save('ProgramEditForm', 'new', programData);
    
    QUnit.ok(typeof program != 'undefined' && typeof program.id != 'undefined', 'Program saved');

    //сравниваем то что записано с тем, что передавали
    var loadData = Asyst.API.Form.load('ProgramEditForm', program.id);
    var sameFlag = true;
    for (var c in programData) {
        if (programData.hasOwnProperty(c)) {
            if (!loadData.hasOwnProperty(c) || JSON.stringify(loadData[c]) !== JSON.stringify(programData[c]))
                sameFlag = false;
        }
    }
    QUnit.ok(sameFlag, 'Loaded Program same as saved');
    if (!sameFlag) {
        QUnit.ok(false, 'data: ' + JSON.stringify(programData) + '\r\n loadData: ' + JSON.stringify(loadData));
    }

    //пытаемся перевести на следующий этап (облом, т.к. нет точек для этого)
    var d = Asyst.API.Phase.moveNext('Program', program.id, {}, false, function (result) {
            QUnit.ok(false, 'Program has been moved. Incorrect');
        },
        function (message, info, context) {
            QUnit.ok(true, 'Program has not been moved. It\'s correct');
        }
    );
    
    //создаем точку, чтобы можно было успешно перевести
    pointData.ParentId = program.id;
    var point = Asyst.API.Entity.save('Point', 'new', pointData);
    //переводим программу на следующий этап
    Asyst.API.Phase.moveNext('Program', program.id, {}, false, function (result) {
        QUnit.ok(true, 'Program has been moved. It\'s correct');
    },
        function (message, info, context) {
            QUnit.ok(false, 'Program has not been moved. It\'s incorrect. ' + JSON.stringify(info));

        }
    );
    //переводим программу на предыдущий этап
    Asyst.API.Phase.movePrev('Program', program.id, function () {
        QUnit.ok(true, 'Program has been moved to previous phase. It\'s correct');
    },
        function (message, info, context) {
            QUnit.ok(false, 'Program has not been moved to previous phase. It\'s incorrect. ' + JSON.stringify(info));
        }
    );

    //пытаемся удалить (облом, т.к. есть связи)
    QUnit.throws(function() {
        var removed = Asyst.API.Entity.remove('Program', program.id);
    },
        'reference error at deleting record with reference in multifield'
    );
    
    //чистим все и удаляем
    var removed = Asyst.API.Entity.remove('Point', point.id);
    QUnit.ok(removed, "Point has been deleted");
    
    programData.ActivityGoal = [];
    Asyst.API.Form.save('ProgramEditForm', program.id, programData);
    removed = Asyst.API.Entity.remove('Program', program.id);
    
    QUnit.ok(removed, "Program has been deleted");
});

test("test Asyst.API.View\Form\Entity", function () {
    
    var loadSame = JSON.parse('{"EntityId":"c98c1b07-0af9-4738-8582-5e26443b534a","EntityName":"Document","KeyName":"DocumentId","columns":[{"id":"Position","name":"Номер","field":"Position","width":50,"sortable":true,"kind":"integer","format":""},{"id":"Name","name":"Название","field":"Name","width":200,"sortable":true,"kind":"text","format":""},{"id":"Entity","name":"Сущность","field":"Entity","width":200,"sortable":true,"kind":"text","format":""},{"id":"ActivityPhase","name":"Этап","field":"ActivityPhase","width":80,"sortable":true,"kind":"text","format":""}],"groups":[{"name":"Entity","expression":""}]}');
    var dataCount = 47;

    //грузим представление и сравниваем с тем что выше. dataCount может прийдется подкорректировать 
    var loadedView = Asyst.API.View.load('DocumentView');
    
    var sameFlag = true;
    for (var c in loadSame) {
        if (loadSame.hasOwnProperty(c)) {
            if (!loadedView.hasOwnProperty(c) || JSON.stringify(loadedView[c]) !== JSON.stringify(loadSame[c]))
                sameFlag = false;
        }
    }
    QUnit.ok(sameFlag, 'Loaded View same as saved');
    if (!sameFlag) {
        QUnit.ok(false, 'data: ' + JSON.stringify(loadSame) + '\r\n loadData: ' + JSON.stringify(loadedView));
    }
    QUnit.ok(loadedView.data.length == dataCount, 'dataCount correct');

    
    //сохраняем новый документ и смотрим, что в представление он добавился
    var res = Asyst.API.Entity.save('Document', 'new', documentData);
    
    loadedView = Asyst.API.View.load('DocumentView');
    QUnit.ok(loadedView.data.length == dataCount+1, "added document success loaded");
    //удаляем документ
    removed = Asyst.API.Entity.remove('Document', res.id);
    QUnit.ok(removed, "Document has been deleted");
    
    //проверяем работу фильтра по пользователю
    //для этого пользователя "мои программы" должно быть пустым
    loadedView = Asyst.API.View.load('MyProgram');
    QUnit.ok(loadedView.data.length == 0, "Filter by UserAccount");

    //проверяем работу фильтра по контексту для представлений.
    //создаем программу. Гант для неё изначально пустой.
    var program = Asyst.API.Form.save('ProgramEditForm', 'new', programData);
    
    loadedView = Asyst.API.View.load('Gantt', { ActivityId: program.id });
    QUnit.ok(loadedView.data.length == 0, "Filter by context data. Step 1");
    
    //теперь добавляем точку и проверяем что она появиться
    pointData.ParentId = program.id;
    var point = Asyst.API.Entity.save('Point', 'new', pointData);
    
    loadedView = Asyst.API.View.load('Gantt', { ActivityId: program.id });
    QUnit.ok(loadedView.data.length == 1, "Filter by context data. Step 2");
    
    //чистим точку и программу
    var removed = Asyst.API.Entity.remove('Point', point.id);
    QUnit.ok(removed, "Point has been deleted");

    programData.ActivityGoal = [];
    Asyst.API.Form.save('ProgramEditForm', program.id, programData);
    removed = Asyst.API.Entity.remove('Program', program.id);

    QUnit.ok(removed, "Program has been deleted");
});


*/