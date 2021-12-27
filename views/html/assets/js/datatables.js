/* ============================================================
 * DataTables
 * Generate advanced tables with sorting, export options using
 * jQuery DataTables plugin
 * For DEMO purposes only. Extract what you need.
 * ============================================================ */
(function ($) {
  'use strict';

  var responsiveHelper = undefined;
  var breakpointDefinition = {
    tablet: 1024,
    phone: 480,
  };
  let customerSignature = '';
  FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginFileEncode);
  FilePond.parse(document.body);
  // Customer Spinner
  hideNewCustomerSpinner();
  function showNewCustomerSpinner() {
    $(`#addCustomerSpinner`).show();
  }
  function hideNewCustomerSpinner() {
    $(`#addCustomerSpinner`).css('display', 'none');
  }

  // Initialize datatable showing a search box at the top right corner
  var initTableWithSearch = function () {
    var table = $('#tableWithSearch');

    var settings = {
      sDom: "<t><'row'<p i>>",
      destroy: true,
      scrollCollapse: true,
      oLanguage: {
        sLengthMenu: '_MENU_ ',
        sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
      },
      iDisplayLength: 5,
    };

    table.dataTable(settings);

    // search box for table
    $('#search-table').keyup(function () {
      table.fnFilter($(this).val());
    });
  };

  // Initialize datatable with ability to add rows dynamically
  var initTableWithDynamicRows = function () {
    var table = $('#tableWithDynamicRows');

    var settings = {
      sDom: "<t><'row'<p i>>",
      destroy: true,
      scrollCollapse: true,
      oLanguage: {
        sLengthMenu: '_MENU_ ',
        sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
      },
      iDisplayLength: 5,
    };

    table.dataTable(settings);

    $('#show-modal').click(function () {
      $('#addNewAppModal').modal('show');
    });

    // Add customers

    $('#addCustomerForm').submit(function (e) {
      e.preventDefault();
      let form = $(this);
      console.log(form);
      let payload = form.serialize();
      showNewCustomerSpinner();
      axios
        .post('/api/customer', payload)
        .then(({ data }) => {
          let td = ` <tr id=${data._id}>
		              <td class="v-align-middle semi-bold">
		                <p>${data.firstName}</p>
		              </td>
		              <td class="v-align-middle">
		                <p>${data.lastName}</p>
		              </td>
		              <td class="v-align-middle">
		                <p>${data.email}</p>
		              </td>
		              <td class="v-align-middle">
		                <p>${data.address}</p>
		              </td>
		             <td class="v-align-middle">
		                <p>${data.location}</p>
		              </td>
					  					  <td class="v-align-middle">
					  ${
              data.image
                ? `<a href="${data.image}" data-lightbox="${data.image}">
									<img style="width:100%" src="${data.image}">
								</a>`
                : '<p>No ID Found</p>'
            }
                      </td>
					   <td class="v-align-middle">
                        <p>${data.result ? data.result : '<p>Pending</p>'}</p>
                      </td>
		            </tr>`;
          $('tbody').append(td);
        })
        .then(() => hideNewCustomerSpinner())
        .then(() => $('#addNewAppModal').modal('hide'))
        .catch(handleError);
    });
  };

  function handleError(err) {
    clearErrors();
    hideNewCustomerSpinner();
    console.log(err);
    if (err.response.data.message) {
      $(`#errors`).append(`<div id="main-err" style="color:red;">${err.response.data.message}</div>`);
    } else {
      $(`#errors`).append(`<div id="main-err" style="color:red;">Hmmm, somethingn went wrong...</div>`);
    }
  }

  // Initialize datatable showing export options
  var initTableWithExportOptions = function () {
    var table = $('#tableWithExportOptions');

    var settings = {
      sDom: "<'exportOptions'T><'table-responsive sm-m-b-15't><'row'<p i>>",
      destroy: true,
      scrollCollapse: true,
      oLanguage: {
        sLengthMenu: '_MENU_ ',
        sInfo: 'Showing <b>_START_ to _END_</b> of _TOTAL_ entries',
      },
      iDisplayLength: 5,
      oTableTools: {
        sSwfPath: 'assets/plugins/jquery-datatable/extensions/TableTools/swf/copy_csv_xls_pdf.swf',
        aButtons: [
          {
            sExtends: 'csv',
            sButtonText: "<i class='pg-grid'></i>",
          },
          {
            sExtends: 'xls',
            sButtonText: "<i class='fa fa-file-excel-o'></i>",
          },
          {
            sExtends: 'pdf',
            sButtonText: "<i class='fa fa-file-pdf-o'></i>",
          },
          {
            sExtends: 'copy',
            sButtonText: "<i class='fa fa-copy'></i>",
          },
        ],
      },
      fnDrawCallback: function (oSettings) {
        $('.export-options-container').append($('.exportOptions'));

        $('#ToolTables_tableWithExportOptions_0').tooltip({
          title: 'Export as CSV',
          container: 'body',
        });

        $('#ToolTables_tableWithExportOptions_1').tooltip({
          title: 'Export as Excel',
          container: 'body',
        });

        $('#ToolTables_tableWithExportOptions_2').tooltip({
          title: 'Export as PDF',
          container: 'body',
        });

        $('#ToolTables_tableWithExportOptions_3').tooltip({
          title: 'Copy data',
          container: 'body',
        });
      },
    };

    table.dataTable(settings);
  };

  function initTableData() {
    let temp = '';
    showNewCustomerSpinner();
    axios
      .get('/api/customer')
      .then((res) => {
        if (res.data.length > 0) {
          return res.data.forEach((customer) => {
            temp += ` <tr id="${customer._id}">
                      <td class="v-align-middle semi-bold">
                        <p>${customer.firstName}</p>
                      </td>
                      <td class="v-align-middle">
                        <p>${customer.lastName}</p>
                      </td>
                      <td class="v-align-middle">
                        <p>${customer.email}</p>
                      </td>
                      <td class="v-align-middle">
                        <p>${customer.address}</p>
                      </td>
                     <td class="v-align-middle">
                        <p>${customer.location}</p>
                      </td>
					  <td class="v-align-middle">
					  ${
              customer.image
                ? `<a href="${customer.image}" data-lightbox="${customer.image}">
							<img style="width:100%" src="${customer.image}">
						</a>`
                : '<p>No ID Found</p>'
            }
                      </td>
					 <td class="v-align-middle">
                        <p>${customer.result ? customer.result : '<p>Pending</p>'}</p>
                      </td>
                    </tr>`;
          });
        }
        temp = `<tr class="odd"><td valign="top" colspan="6" class="dataTables_empty">No data available in table</td></tr>`;
        return;
      })
      .then(() => $('#allCustomers').append(temp))
      .then(() => hideNewCustomerSpinner());
  }

  function clearErrors() {
    $(`#errors`).empty();
  }
  $(document).on('click', '#tableWithSearch > tbody > tr', function () {
    axios
      .get(`/api/customer/${$(this).attr('id')}`)
      .then((res) => showCustomerInfoModal(res.data))
      .catch((err) => {
        console.log(err);
      });
  });

  function showCustomerInfoModal(customer) {
    let newObj = cleanMongooseObject(customer);
    generateCustomerDetailTable(newObj);
    $(`#customerInfoBtn`).click();
  }
  function generateCustomerDetailTable(customer) {
    let tr = '';
    for (const property in customer) {
      const updatedProp = property.replace(/([A-Z])/g, ' $1');
      const finalResult = updatedProp.charAt(0).toUpperCase() + updatedProp.slice(1);
      tr += `
			<tr>
				<td class="v-align-middle semi-bold">${finalResult}</td>
				<td class="v-align-middle">
							  ${
                  property.toLowerCase() === 'image' || property.toLowerCase() === 'customersignature'
                    ? `<a href="${customer[property]}" data-lightbox="${customer[property]}">
							<img style="width:100%" src="${customer[property]}">
						</a>`
                    : customer[property]
                }</td>
			</tr>`;
    }
    $('#customerDetailTable').empty().append(tr);
  }
  function cleanMongooseObject(obj) {
    for (const property in obj) {
      if (property === '_id' || property === '__v' || property === 'createdAt' || property === 'updatedAt' || property === 'id' || property === 'imageType') {
        delete obj[property];
      }
    }
    return obj;
  }
  // Electronic Signature
  (function () {
    window.requestAnimFrame = (function (callback) {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    var canvas = document.getElementById('sig-canvas');
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 4;

    var drawing = false;
    var mousePos = {
      x: 0,
      y: 0,
    };
    var lastPos = mousePos;

    canvas.addEventListener(
      'mousedown',
      function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
      },
      false
    );

    canvas.addEventListener(
      'mouseup',
      function (e) {
        drawing = false;
      },
      false
    );

    canvas.addEventListener(
      'mousemove',
      function (e) {
        mousePos = getMousePos(canvas, e);
      },
      false
    );

    // Add touch event support for mobile
    canvas.addEventListener('touchstart', function (e) {}, false);

    canvas.addEventListener(
      'touchmove',
      function (e) {
        var touch = e.touches[0];
        var me = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        canvas.dispatchEvent(me);
      },
      false
    );

    canvas.addEventListener(
      'touchstart',
      function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var me = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        canvas.dispatchEvent(me);
      },
      false
    );

    canvas.addEventListener(
      'touchend',
      function (e) {
        var me = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(me);
      },
      false
    );

    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
      };
    }

    function getTouchPos(canvasDom, touchEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top,
      };
    }

    function renderCanvas() {
      if (drawing) {
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        lastPos = mousePos;
      }
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
      'touchstart',
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
    document.body.addEventListener(
      'touchend',
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
    document.body.addEventListener(
      'touchmove',
      function (e) {
        if (e.target == canvas) {
          e.preventDefault();
        }
      },
      false
    );
    (function drawLoop() {
      requestAnimFrame(drawLoop);
      renderCanvas();
    })();

    function clearCanvas() {
      canvas.width = canvas.width;
    }

    // Set up the UI
    var sigText = $('#sig-dataUrl');
    var sigImage = document.getElementById('sig-image');
    var clearBtn = document.getElementById('sig-clearBtn');
    var submitBtn = document.getElementById('sig-submitBtn');
    clearBtn.addEventListener(
      'click',
      function (e) {
        clearCanvas();
        sigText.innerHTML = 'Data URL for your signature will go here!';
        sigImage.setAttribute('src', '');
      },
      false
    );
    submitBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        customerSignature = canvas.toDataURL();
        sigText.val(customerSignature);
        sigImage.setAttribute('src', customerSignature);
      },
      false
    );
  })();

  initTableWithSearch();
  initTableWithDynamicRows();
  initTableWithExportOptions();
  initTableData();
})(window.jQuery);
