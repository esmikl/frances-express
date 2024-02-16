<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $formdata = json_decode(file_get_contents("php://input"), true);

    if(!empty($formdata)) {
        $name = $formdata['name'];
        $message = $formdata['message'];
        $phone = $formdata['phone'];
        $email = $formdata['email'];
        
        $contactData = array(
            'name' => $name,
            'message' => $message,
            'phone' => $phone,
            'email' => $email
        );

        $this.sendEmail($contactData);
    }

    function sendEmail($contactData) {
        $message = 'Hello Curtie! Someone has submitted the contact form on francesexpress.com.' . "\r\n" . "\r\n" . 'Here are the details:' . "\r\n" . "\r\n";
        $message .= 'Name: '.$contactData['name'].'' . "\r\n";
        $message .= 'Message: '.$contactData['message'].'' . "\r\n";
        
        if(!empty($contactData['phone'])) {
            $message .= 'Phone: '.$contactData['phone'].'' . "\r\n";
        }
        
        $message .= 'Email: '.$contactData['email'].'' . "\r\n";

        $to      = 'esmikl@yahoo.com';
        $subject = 'Contact form submission from website';
        $headers = 'From: esmikl@yahoo.com' . "\r\n" .
            'Reply-To: esmikl@yahoo.com' . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        mail($to, $subject, $message, $headers);
    }
?>
