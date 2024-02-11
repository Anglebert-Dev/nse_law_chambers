<?php
ini_set("SMTP", "smtp.example.com");
ini_set("smtp_port", "587");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Set up email parameters
    $to = "anglebertsh@gmail.com";
    $headers = "From: $name <$email>";
    $body = "Subject: $subject\n\nMessage: $message";

    // Send email
    mail($to, $subject, $body, $headers);
}
?>