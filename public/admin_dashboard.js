function openView(evt, viewName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(viewName).style.display = "block";
  evt.currentTarget.className += " active";
}

const usageTrends = document.getElementById('usage-trends-btn');

usageTrends.addEventListener("click", (e) => {
    e.preventDefault();
    openView(e, 'usage-trends')
});

const customView = document.getElementById('custom-view-btn');

customView.addEventListener("click", (e) => {
    e.preventDefault();
    openView(e, 'custom-view')
});

usageTrends.click();