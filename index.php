<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SHOWDATES.TV</title>
    <link rel="stylesheet" href="css/stylesheet.css" type="text/css">
  </head>
  <body>
    <div class="content_container">
      <header>
        <nav>
          <a href="index.php" id="brand">Showdates.tv</a>
          <div id="search_toggle">
            <svg class="search_active" fill="#FFFFFF" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M19,6.41C19,6.41,17.59,5,17.59,5C17.59,5,12,10.59,12,10.59C12,10.59,6.41,5,6.41,5C6.41,5,5,6.41,5,6.41C5,6.41,10.59,12,10.59,12C10.59,12,5,17.59,5,17.59C5,17.59,6.41,19,6.41,19C6.41,19,12,13.41,12,13.41C12,13.41,17.59,19,17.59,19C17.59,19,19,17.59,19,17.59C19,17.59,13.41,12,13.41,12C13.41,12,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41M19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41C19,6.41,19,6.41,19,6.41"/>
            </svg>
          </div>
          <div id="search">
            <input class="searchbar_input" placeholder="Search for a tv show..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          </div>
        </nav>
      </header>
      <div class="autocomplete_suggestions">
        <div class="highlight_card"></div>
        <ul>
        </ul>
      </div>
      <section id="content">
      </section>
      <footer>
        <div class="container">
          <div class="left_section">
            <p>Designed and developed by Mats Jacobsen</p>
            <p class="copyright">&copy 2017 showdates.tv</p>
          </div>
          <div class="right_section">
            <p>Get in touch: <span class="contact_email">me@matsjacobsen.no</span></p>
          </div>
        </div>
      </footer>
    </div>

    <script src="js/anime.min.js"></script>
    <script type="text/javascript" src="js/date.js"></script>
    <script
    src="https://code.jquery.com/jquery-3.2.1.min.js"
    integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
    crossorigin="anonymous"></script>
    <script
    src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
    integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
    crossorigin="anonymous"></script>
    <script type="text/javascript" src="js/script.js"></script>
  </body>
</html>
