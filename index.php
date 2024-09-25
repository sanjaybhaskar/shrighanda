<!doctype html>
<html>

	<head>
		<meta charset="utf-8">
		<title>Shrighandha</title>
		<base href="/">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<link rel="icon" type="image/x-icon" href="favicon.ico">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/angular-app/styles.bundle.css">
	</head>
    <body>

        <!-- Insert your Angular app here -->
        <div id="angular-app">
            <app-root></app-root>
        </div>

        <!-- Include Angular scripts -->
        <script src="<?php echo get_template_directory_uri(); ?>/angular-app/inline.bundle.js"></script>
				<script src="<?php echo get_template_directory_uri(); ?>/angular-app/polyfills.bundle.js"></script>
        <script src="<?php echo get_template_directory_uri(); ?>/angular-app/scripts.bundle.js"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/angular-app/vendor.bundle.js"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/angular-app/main.bundle.js"></script>


    </body>
</html>
