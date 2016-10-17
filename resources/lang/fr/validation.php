<?php

return [
    'custom' => [
        'name' => [
            'required' => 'Vous devez saisir votre nom d\'utilisateur.',
            'unique' => 'Ce nom d\'utilisateur est déjà pris.'
        ],
        'email' => [
            'required' => 'Vous devez saisir votre email.',
        ],
        'password' => [
            'required' => 'Vous devez saisir votre mot de passe.',
            'min' => 'Votre mot de passe doit contenir au moins :min caractères.',
            'confirmed' => 'Vous devez confirmer votre mot de passe.'
        ]
    ]
];