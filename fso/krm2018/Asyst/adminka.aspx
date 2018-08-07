<%@ Page Title="" Language="C#" MasterPageFile="~/Admin.Master" AutoEventWireup="true" CodeBehind="adminka.aspx.cs" Inherits="PRIZ._adminka" EnableSessionState="false"%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <% Response.Write(ViewJS); %> 
    <% Response.Write(ViewCSS); %> 
    <% Response.Write(PMPractice.Db.Web.WebUtils.InitUser(User)); %>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <% Response.Write(SpecBody); %>
    <!--
    <link href="/asyst/jsControls/FileAPI/statics/main.css " rel="stylesheet">
    <script>
        window.FileAPI = {
            debug: false // debug mode
            , staticPath: '/asyst/jsControls/FileAPI/FileAPI/' // path to *.swf
        };
    </script>

<script src="/asyst/jsControls/FileAPI/FileAPI/FileAPI.min.js"></script>
<script src="/asyst/jsControls/FileAPI/FileAPI/FileAPI.exif.js"></script>
<script src="/asyst/jsControls/FileAPI/jquery.fileapi.js"></script>
    <% Response.Write(Body); %>
    
    <div id="dnd" class="b-upload b-upload_dnd" style="width:300px">
   
        <div class="btn btn-success btn-small js-fileapi-wrapper">
								<div class="b-upload__dnd">Drag and drop, automatic upload</div>
								<input type="file" name="filedata" multiple="">
							</div>     
   
   <div class="b-upload__dnd-not-supported">
      <div class="btn btn-success js-fileapi-wrapper">
         <span>Choose files</span>
         <input type="file" name="filedata" multiple="">
      </div>
   </div>
   <div class="js-files b-upload__files">
      <div class="js-file-tpl b-thumb" data-id="<%Response.Write(str1);%>" title="<%Response.Write(str2);%>">
         <div class="b-thumb__progress progress progress-small"><div class="bar"></div></div>
         <div class="b-thumb__name"><% Response.Write(str2); %></div>
      </div>
   </div>
</div>
    
    <script>
        $('#dnd').fileapi({            
            url: '/asyst/Handlers/DocumentUploadHandler.ashx',
            paramName: 'filedata',
            autoUpload: true,
            elements: {
                list: '.js-files',
                file: {
                    tpl: '.js-file-tpl',
                    upload: { show: '.progress' },
                    //complete: { hide: '.progress' },
                    progress: '.progress .bar'
                },
                dnd: {
                    el: '.b-upload__dnd',
                    hover: 'b-upload__dnd_hover',
                    fallback: '.b-upload__dnd-not-supported'
                }
            }
        });
    </script>
    -->
    <script>
        function upload(file, onSuccess, onError, onProgress) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/asyst/api/admin/update", true);
            xhr.onload = xhr.onerror = function () {
                
                if (this.status != 200 || this.responseText != 'OK') {
                    if (onError) {
                        onError(this);
                    }
                    return;
                }
                if (onSuccess) {
                    onSuccess();
                }
            };
            xhr.upload.onprogress = function (event) {
                if (onProgress) {
                    onProgress(event.loaded, event.total);
                }
            };
            xhr.send(file);
            
            //var params = encodeURIComponent('{"action":"update"}');
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //xhr.send(params);
            
        } 
 
        function ShowUpdateDialog() {
            var dlg='<form name="upload">\
                <input type="file" name="file1" style="width:300px">\
                <input type="submit" value="Загрузить">\
            </form>';
            Dialog('Выберите файл для обновления', dlg, []);


            var form = document.forms.upload;
            form.onsubmit = function() {
                var file = this.elements.file1.files[0];
                if (file) upload(file, function () {
                    $('form[name="upload"]').append('<div class="label label-success" label="">Файл ' + file.name + ' успешно выполнен</div>');
                }, function () {
                    $('form[name="upload"]').append('<div class="label label-important" label="">Во время выполнения файла ' + file.name + ' произошла ошибка</div>');
                }, null);   
                return false;
            }
        }


    </script>
</asp:Content>

