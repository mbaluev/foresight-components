<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="AccessMatrix.aspx.cs" Inherits="PRIZ.AccessMatrixPage" EnableSessionState="false"%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style>
        .navbar {
            margin-bottom: 4px;
        }
        
        body 
        {
            padding: 4px;
            background-color: #fff;
        }
        
        pre
        {
            display: inline-block;
            padding: 2px;
            margin: 0px;
            font-family: "Trebuchet MS", Helvetica, Arial, sans-serif !important;
        }
        
        .table
        {
            font-size: 11px;
        }
        
        input, label, select
        {
            font-size: 11px;
            line-height: 16px;
        }
        
        .chzn-container {
            font-size: 11px;
        }
        
        .tree-phase
        {
            color:#0088CC;
            font-weight:bold;
        }
        
        .tree-element
        {
            padding-left: 18px;
            font-weight:bold;
            font-size:12px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .tree-item
        {
            padding-left: 36px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        a.access-rights:hover
        {
            text-decoration: none;
        }
        
        .access-rights
        {
            color:#666 !important;
        }
        
        .access-rights.custom
        {
            color:#000 !important;
        }
        
         .table .tree-element-row td
         {
            color: #333;
            font-weight: bold;
            text-shadow: 1px 1px 1px white;
            box-shadow: 0 1px 0 #FFFFFF inset;
            background-color: #eeeeee; /* Old browsers */
            background-repeat: repeat-x; /* Repeat the gradient */
            background-image: -moz-linear-gradient(top, #f5f5f5 0%, #eeeeee 100%); /* FF3.6+ */
            background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#eeeeee)); /* Chrome,Safari4+ */
            background-image: -webkit-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Chrome 10+,Safari 5.1+ */
            background-image: -ms-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* IE10+ */
            background-image: -o-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Opera 11.10+ */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5f5f5', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */
            background-image: linear-gradient(to top, #f5f5f5 0%,#eeeeee 100%); /* W3C */
         }
         
         .table th
         {
            box-shadow: 0 1px 0 #FFFFFF inset;
            background-color: #eeeeee; /* Old browsers */
            background-repeat: repeat-x; /* Repeat the gradient */
            background-image: -moz-linear-gradient(top, #f5f5f5 0%, #eeeeee 100%); /* FF3.6+ */
            background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#eeeeee)); /* Chrome,Safari4+ */
            background-image: -webkit-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Chrome 10+,Safari 5.1+ */
            background-image: -ms-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* IE10+ */
            background-image: -o-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Opera 11.10+ */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5f5f5', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */
            background-image: linear-gradient(to top, #f5f5f5 0%,#eeeeee 100%); /* W3C */
         }
         
         legend
         {
             font-size: 12px;
             font-weight:bold;
             color:#a5a5a5;
             margin-bottom: 8px;
             line-height: 18px;
         }
         
         legend + .control-group {
            margin-top: 0px;
        }

        .control-group {
            margin-bottom: 9px;
        }
         
    </style>
</asp:Content>

<asp:Content ContentPlaceHolderID="pageHeaderPlaceHolder" runat="server">
    <% if (User.IsFunctionalAdministrator)
       { %> 
    <div class="navbar fixed-top accessmatrix">
        <div class="navbar-inner">
            <div class="container ">
                <a class="brand" href="#">
                    Настройка доступа
                </a>
                
                <ul class="nav">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <span id="currentEntity"><% Response.Write(CurrentEntityHtml); %></span>
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <% Response.Write(EntityListHtml); %>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <span id="currentPhase"><% Response.Write(CurrentPhaseHtml); %></span>
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <% Response.Write(PhaseListHtml); %>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <span id="currentRule"><% Response.Write(CurrentRuleHtml); %></span>
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <% Response.Write(RuleListHtml); %>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <% } %>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% if (User.IsFunctionalAdministrator)
       { %> 
    <table class="table table-striped table-bordered table-condensed">
        <% Response.Write(BuildTable()); %>
    </table>

    <script type="text/javascript">
        <% Response.Write(jsData); %>
        $(".chzn-select").chosen();
        var el = $('body > .container');
        el.removeClass();
        el.addClass('container-fluid');
        el.css({'width':'100%', 'padding':'0', 'margin':'0', 'background-color':'#fff'});

        var entitySelect;
        var roleSelect;
        var selectedId;
        var selectedItem;
        var selectedItemType;
        var selectedItemId;
        var selectedRoles;
        var canceled; 

        function editItem(itemType, itemId, title) {
            selectedItem = Items[itemType + '' + itemId];
            if(selectedItem)
                selectedId = selectedItem.Id;
            else
                selectedId = undefined;
            selectedItemType = itemType;
            selectedItemId = itemId;
            selectedRoles = {};

            $('#rolesPlaceholder').html("");
            var allowSeparate = false;

            if(selectedItem)
            {
                $('#IsRequired')[0].checked = selectedItem.IsRequired;
                $('#DefaultIsSeparate')[0].checked = selectedItem.DefaultIsSeparate;
                $('#RoleDefaultIsSeparate')[0].checked = selectedItem.RoleDefaultIsSeparate;
                
                if(selectedItem.DefaultIsVisible)
                {
                    if(selectedItem.DefaultIsReadonly)
                        $('#DefaultAccess').val("1");
                    else
                        $('#DefaultAccess').val("2");
                }
                else
                    $('#DefaultAccess').val("0");
                $('#DefaultAccess').trigger("chosen:updated");

                $('#DefaultReview').val(selectedItem.DefaultReviewCycleId);
                $('#DefaultReview').trigger("chosen:updated");

                if(selectedItem.RoleDefaultIsVisible)
                {
                    if(selectedItem.RoleDefaultIsReadonly)
                        $('#RoleDefaultAccess').val("1");
                    else
                        $('#RoleDefaultAccess').val("2");
                }
                else
                    $('#RoleDefaultAccess').val("0");
                $('#RoleDefaultAccess').trigger("chosen:updated");

                $('#RoleDefaultReview').val(selectedItem.RoleDefaultReviewCycleId);
                $('#RoleDefaultReview').trigger("chosen:updated");

                $(".chzn-select").chosen();
                $(".chzn-select-deselect").chosen({ allow_single_deselect: true });

                for(var r in selectedItem.Roles)
                {
                    var role = selectedItem.Roles[r];
                    renderRole(role.RoleId, role.ParentEntityName, role);
                }
                allowSeparate = selectedItem.AllowSeparate;
            }
            else
            {
                $('#IsRequired')[0].checked = false;
                $('#DefaultIsSeparate')[0].checked = false;
                $('#RoleDefaultIsSeparate')[0].checked = false;
                $('#DefaultAccess').val("1");
                $('#DefaultAccess').trigger("chosen:updated");
                $('#DefaultReview').val("");
                $('#DefaultReview').trigger("chosen:updated");
                $('#RoleDefaultAccess').val("2");
                $('#RoleDefaultAccess').trigger("chosen:updated");
                $('#RoleDefaultReview').val("");
                $('#RoleDefaultReview').trigger("chosen:updated");

                $(".chzn-select").chosen();
                $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
            }

            $('#item-header').html(title);

            canceled = true;

            $('#editItemModal').on('hidden', function () {
                endEdit();
            });

            $('#editItemModal').modal({ backdrop: "static", show: true }).css({
                'top': '35%'
            });
            if (!allowSeparate)
                $('.separate').addClass("hide");

            if (itemType == 'phase')
                $('#addRoleButton').hide();
            else
                $('#addRoleButton').show();


        }

       function saveItem()
        {
            var data = {};
            data.Id = selectedId;
            data.ItemType = selectedItemType;
            data.ItemId = selectedItemId;

            data.IsRequired = $('#IsRequired')[0].checked;
            data.DefaultIsVisible = $('#DefaultAccess').val() != "0";
            data.DefaultIsReadonly = $('#DefaultAccess').val() != "2";
            data.DefaultReviewCycleId = $('#DefaultReview').val();
            data.DefaultIsSeparate = $('#DefaultIsSeparate')[0].checked;
            data.RoleDefaultIsVisible = $('#RoleDefaultAccess').val() != "0";
            data.RoleDefaultIsReadonly = $('#RoleDefaultAccess').val() != "2";
            data.RoleDefaultReviewCycleId = $('#RoleDefaultReview').val();
            data.RoleDefaultIsSeparate = $('#RoleDefaultIsSeparate')[0].checked;
            data.Roles = {};
            for(var i in selectedRoles)
            {
                var src = selectedRoles[i];
                var name = "Role" + src.RoleId;
                if(src.ParentEntity)
                    name = src.ParentEntity.Name + name;

                var dst = {};
                dst.Id = 0;
                if(selectedItem)
                {
                    if(selectedItem.Roles[name])
                        dst.Id = selectedItem.Roles[name].Id;
                }
                dst.RoleId = src.RoleId;
                dst.RoleName = Roles[src.RoleId].Name;
                if(src.ParentEntity)
                {
                    dst.ParentEntityId = src.ParentEntity.Id;
                    dst.ParentEntityName = src.ParentEntity.Name;
                    dst.ParentEntityTitle = src.ParentEntity.Title;
                }
                else
                    dst.ParentEntityId = "";
                dst.IsVisible = $('#' + name + 'Access').val() != "0";
                dst.IsReadonly = $('#' + name + 'Access').val() != "2";
                dst.ReviewCycleId = $('#' + name + 'Review').val();
                //dst.IsSeparate = $('#' + name + 'Separate')[0].checked;
                data.Roles[name] = dst;
            }

            Save(data);

            canceled = false;

            $('#editItemModal').modal('hide');
        }

        function endEdit()
        {
            if(canceled)
            {
                if(!Items[selectedItemType + selectedItemId])
                {
                    $('#chk' + selectedItemType + selectedItemId)[0].checked = false;
                }
            }
        }

        function clearItem(itemType, itemId, id)
        {
            var data = {};
            data.EntityId = EntityId;
            data.PhaseId = PhaseId;
            data.RuleId = RuleId;
            data.ItemType = itemType;
            data.Id = id;
            
            $.ajax({
                url: "/asyst/accessmatrix",
                data: JSON.stringify(data),
                dataType: "json",
                type: "DELETE",
                async: false,
                cache: false,
                success: function (retData) {
                    if (typeof retData !== "null" && typeof retData !== "undefined") {
                        result = Asyst.protocol.format(retData);
                        if (result && result.thisIsError == true) {
                            if (result.message == Globa.LicenseError) {
                                LicenseErrorHandler(result.message, result.info);
                            }
                            return;
                        }
                    }
                    delete Items[itemType + itemId];
                    $('#' + itemType + itemId + ' .access-rights').html(getRightsText());
                    $('#' + itemType + itemId + ' .access-rights').removeClass('custom');
                    $('#chk' + itemType + itemId)[0].checked = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Ошибка при сохранении.");
                }
            });
        }

        function checkItem(itemType, itemId)
        {
            var item = Items[itemType + itemId];
            if (item) {
                if (confirm('Это действие сбросит текущие настройки. Вы уверены?'))
                    clearItem(itemType, itemId, item.Id);
                else {
                    $('#chk' + itemType + itemId).attr('checked', 'true');
                }
                
            } else
                editItem(itemType, itemId, $('tr#' + itemType + itemId + ' .tree-item').text());
        }

        function Save(data)
        {
            data.EntityId = EntityId;
            data.PhaseId = PhaseId;
            data.RuleId = RuleId;
            
            $.ajax({
                url: "/asyst/accessmatrix",
                data: JSON.stringify(data),
                dataType: "json",
                type: "POST",
                async: false,
                cache: false,
                success: function (retData) {
                    if (typeof retData !== "null" && typeof retData !== "undefined") {
                        result = Asyst.protocol.format(retData);
                        if (result && result.thisIsError == true) {
                            if (result.message == Globa.LicenseError) {
                                LicenseErrorHandler(result.message, result.info);
                            }
                            return;
                        }
                    }
                    Items[data.ItemType + data.ItemId] = retData;

                    $('#' + data.ItemType + data.ItemId + ' .access-rights').html(getRightsText(retData));
                    $('#' + data.ItemType + data.ItemId + ' .access-rights').addClass('custom');
                    $('#chk' + data.ItemType + data.ItemId)[0].checked = true;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Ошибка при сохранении.");
                }
            });
    
        }

        function AddPhaseRule(ruleId) {
            
            if (typeof ruleId != 'undefined' && ruleId != null && ruleId != '' && ruleId != 0) {
                Asyst.APIv2.Entity.save({ entityName: 'AccessPhaseRule', dataId: 'new', data: { EntityId: EntityId, RuleId: ruleId, ActivityPhaseId: PhaseId }, success: function () { location.reload(); } });
            }
            else {
                alert("Неверное правило");
            }
        }

        function DeletePhaseRule(accessPhaseRuleId) {
            if (typeof accessPhaseRuleId != 'undefined' && accessPhaseRuleId != null && accessPhaseRuleId != '' && accessPhaseRuleId != 0) {
                Asyst.APIv2.Entity.delete({ entityName: 'AccessPhaseRule', dataId: accessPhaseRuleId, success: function() { location.reload(); } });
            }
            else {
                alert("Неверное правило");
            }
        }

        function addRoleModal() {
            entitySelect = $("#addRoleModalEntity");
            roleSelect = $("#addRoleModalRole");

            entitySelect.chosen().change(ParentEntityChanged);
            ParentEntityChanged();

            $('#addRoleModal').modal('show');

        }

        function addRole() {
            $('#addRoleModal').modal('hide');

            var roleId = roleSelect.val();

            renderRole(roleId, entitySelect.val());

        }

        function deleteRole(roleId, parentEntityName) {
            delete selectedRoles[parentEntityName + 'Role' + roleId];
            var $section = $("#" + parentEntityName + "Role" + roleId + "Section");
            $section.remove();
        }

        function renderRole(roleId, parentEntityName, role)
        {
            var parentEntity;
            var parentEntityTitle = "";
            if(parentEntityName)
            {
                parentEntity = Entities[parentEntityName];
                parentEntityTitle = parentEntity.Title + " \\ ";
            }
            else
                parentEntityName = "";

            var roleName = Roles[roleId].Name;

            var body = $('#rolesPlaceholder');

            selectedRoles[parentEntityName + 'Role' + roleId] = {RoleId: roleId, ParentEntity: parentEntity};

            var access = "2";
            var review = "";
            if(role)
            {
                if(role.IsVisible)
                {
                    if(role.IsReadonly)
                        access = "1";
                }
                else
                    access = "0";

                review = role.ReviewCycleId;
            }

            var s = "";
            s += "<fieldset id='" + parentEntityName + "Role" + roleId + "Section'>";
            s += "    <legend>" + parentEntityTitle + roleName + "<button class=\"close\" onclick=\"deleteRole(" + roleId + ", '" + parentEntityName + "');\">&times;</button></legend>";
            s += "    <div class='row'>";
            s += "        <div class='span'>";
            s += "            <div class='control-group'>";
            //s += "                <label class='control-label' for='Role" + parentEntityName + roleId + "Access'>Доступ</label>";
            s += "                <div class='controls'>";
            s += "                    <select class='chzn-select' id='" + parentEntityName + 'Role' + roleId + "Access' data-placeholder='Согласование'>";
            s += "                        <option value='0'>Скрыть</option>";
            s += "                        <option value='1'>Чтение</option>";
            s += "                        <option value='2'>Правка</option>";
            s += "                    </select>";
            s += "                </div>";
            s += "            </div>";
            s += "        </div>";
            s += "        <div class='span3'>";
            s += "            <div class='control-group'>";
            //s += "                <label class='control-label' for='Role" + parentEntityName + roleId + "Review'>Согласование</label>";
            s += "                <div class='controls'>";
            s += "                    <select class='chzn-select-deselect' id='" + parentEntityName + 'Role' + roleId + "Review' data-placeholder='Согласование'>";
            s += "                        <option></option>";
            for(var ri in Reviews)
                s += "                        <option value='" + Reviews[ri].Id + "'>" + Reviews[ri].Name +"</option>";
            s += "                    </select>";
            s += "                </div>";
            s += "            </div>";
            s += "        </div>";
            //s += "        <div class='span2 separate'>";
            //s += "            <div class='control-group'>";
            //s += "                <div class='controls'>";
            //s += "                    <label class='checkbox'>";
            //s += "                        <input id='" + parentEntityName + 'Role' + roleId + "Separate' type='checkbox'> Раздельное согласование";
            //s += "                    </label>";
            //s += "                </div>";
            //s += "            </div>";
            //s += "        </div>";
            s += "    </div>";
            s += "</fieldset>";

            body.append(s);

            $("#" + parentEntityName + 'Role' + roleId + "Access").chosen();
            $("#" + parentEntityName + 'Role' + roleId + "Review").chosen({ allow_single_deselect: true });

            $("#" + parentEntityName + 'Role' + roleId + "Access").val(access + '');
            $("#" + parentEntityName + 'Role' + roleId + "Access").trigger("chosen:updated");
            $("#" + parentEntityName + 'Role' + roleId + "Review").val(review + '');
            $("#" + parentEntityName + 'Role' + roleId + "Review").trigger("chosen:updated");
        }

        function ParentEntityChanged()
        {
            var name = entitySelect.val();
            if(!name)
                name = EntityName;

            var entity = Entities[name];
            var roles = entity.Roles;

            var el = $('#addRoleModalRole');
                    
            var select = el[0];
            select.options.length = 0;
            var i = 0;
            for (var idx in roles) {
                if(!selectedRoles || !selectedRoles[entitySelect.val() + 'Role' + roles[idx].Id])
                {
                    select.options.length = i + 1;
                    select.options[i].text = roles[idx].Name;
                    select.options[i].value = roles[idx].Id;
                    i++;
                }
            }
            el.trigger("chosen:updated");
        }

        function getRightsText(item)
        {
            if(!item)
            {
                return 'Права по умолчанию (необязательное, для назначенных на роли - Правка, для остальных - Чтение)';
            }

            var s = "";

            if (item.IsRequired)
                s += "Обязательное.   ";
            else
                s += "Необязательное.   ";

            var first = true;
            for(var r in item.Roles)
            {
                var role = item.Roles[r];
                if (!first)
                    s += "</pre>&nbsp;<pre>"; 
                else
                    s += "<pre>"; 

                if (role.ParentEntityTitle)
                    s += role.ParentEntityTitle + "\\";
                s += Roles[role.RoleId].Name;
                s += ": ";
                if (!role.IsVisible)
                    s += "<span class='label label-important'>Скрыть</span>";
                else if (role.IsReadonly)
                    s += "<span class='label'>Чтение</span>";
                else
                    s += "<span class='label label-success'>Правка</span>";

                if (role.ReviewCycleId > 0)
                    s += ",  согласование: <span class='label label-info'>" + Reviews[role.ReviewCycleId].Name + "</span>";

                first = false;
            }

            if(first)
                s += "Роли:";
            else
                s += "</pre>&nbsp;<pre>Прочие роли: ";

            if (!item.RoleDefaultIsVisible)
                s += "<span class='label label-important'>Скрыть</span>";
            else if (item.RoleDefaultIsReadonly)
                s += "<span class='label'>Чтение</span>";
            else
                s += "<span class='label label-success'>Правка</span>";
            

            if (item.RoleDefaultReviewCycleId > 0)
                s += ",  согласование: <span class='label label-info'>" + Reviews[item.RoleDefaultReviewCycleId].Name + "</span>";

            s += "</pre>&nbsp;<pre>Прочие пользователи: ";
            if (!item.DefaultIsVisible)
                s += "<span class='label label-important'>Скрыть</span>";
            else if (item.DefaultIsReadonly)
                s += "<span class='label'>Чтение</span>";
            else
                s += "<span class='label label-success'>Правка</span>";

            if (item.DefaultReviewCycleId > 0)
                s += ",  согласование: <span class='label label-info'>" + Reviews[item.DefaultReviewCycleId].Name + "</span>";

            s += "</pre>";

            return s;
        }
    </script>
    
    <div class="modal fade" id="editItemModal" style="display:none">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">×</button>
            <h3><span id="item-header">Настройка доступа</span></h3>
        </div>
        <div class="modal-body">
            <label class="checkbox">
                <input id="IsRequired" type="checkbox"> Обязательное
            </label>
            <fieldset>
                <legend>Права по умолчанию для входящих в любую из ролей</legend>
                <div class="row">
                    <div class="span3">
                        <div class="control-group">
                            <!--<label class="control-label" for="RoleDefaultAccess">Доступ</label>-->
                            <div class="controls">
                                <select class="chzn-select" id="RoleDefaultAccess">
                                    <option value="0">Скрыть</option>
                                    <option value="1">Чтение</option>
                                    <option value="2">Правка</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="span3">
                        <div class="control-group">
                            <!--<label class="control-label" for="RoleDefaultReview">Согласование</label>-->
                            <div class="controls">
                                <select class="chzn-select-deselect" id="RoleDefaultReview" data-placeholder="Согласование">
                                    <option></option>
                                    <% Response.Write(reviewHtml); %>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="span2 separate">
                        <div class="control-group">
                            <div class="controls">
                                <label class="checkbox">
                                    <input id="DefaultIsSeparate" type="checkbox"> Раздельное согласование
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Права по умолчанию для не входящих в роли</legend>
                <div class="row">
                    <div class="span3">
                        <div class="control-group">
                            <!--<label class="control-label" for="DefaultAccess">Доступ</label>-->
                            <div class="controls">
                                <select class="chzn-select" id="DefaultAccess">
                                    <option value="0">Скрыть</option>
                                    <option value="1">Чтение</option>
                                    <option value="2">Правка</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="span3">
                        <div class="control-group">
                            <!--<label class="control-label" for="DefaultReview">Согласование</label>-->
                            <div class="controls">
                                <select class="chzn-select-deselect" id="DefaultReview" data-placeholder='Согласование'>
                                    <option></option>
                                    <% Response.Write(reviewHtml); %>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="span2 separate">
                        <div class="control-group">
                            <!--<label class="control-label" for="DefaultReview">Согласование</label>-->
                            <div class="controls">
                                <label class="checkbox">
                                    <input id="RoleDefaultIsSeparate" type="checkbox"> Раздельное согласование
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <span id="rolesPlaceholder"></span>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn pull-left" onclick="addRoleModal()" id="addRoleButton">Добавить роль</a>
            <a href="#" class="btn btn-primary" onclick="saveItem()">Сохранить</a>
            <a href="#" class="btn" data-dismiss="modal">Отмена</a>
        </div>
    </div>

    <div class="modal fade" id="addRoleModal" style="display:none">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">×</button>
            <h3>Выберите роль</h3>
        </div>
        <div class="modal-body">
            <div style="padding-bottom: 10px;">
                <legend for="addRoleModalEntity">Родитель</legend>
                <div class="row">
                    <div class ="span3">
                        <select class="chzn-select" id="addRoleModalEntity">
                            <option value="">Нет</option>
                            <% Response.Write(entitySelectHtml); %>    
                        </select>
                    </div>
                </div>
            </div>
            <div >
                <legend for="addRoleModalRole">Роль</legend>
                <div class="row">
                    <div class="span3">
                        <select class="chzn-select" id="addRoleModalRole">
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" onclick="addRole()">Добавить</a>
            <a href="#" class="btn" data-dismiss="modal">Отмена</a>
        </div>
    </div>
    <% } %>
</asp:Content>

