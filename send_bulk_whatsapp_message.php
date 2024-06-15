<?php

require 'vendor/autoload.php';

use Google\Cloud\Firestore\FirestoreClient;

$projectId = 'your-firebase-project-id';
$phone_numbers = [
    "918075501121" => "John",
    "918075033808" => "Jane"
];

$firestore = new FirestoreClient([
    'projectId' => $projectId,
]);

function addMessage($firestore, $phoneNumber, $recipientName) {
    $collection = $firestore->collection('messages');
    $document = $collection->newDocument();
    $document->set([
        'phoneNumber' => $phoneNumber,
        'recipientName' => $recipientName,
    ]);
}

foreach ($phone_numbers as $number => $name) {
    addMessage($firestore, $number, $name);
}

echo "Messages added to Firestore.";
