# API netypareo

Ceci est une API non-officiel pour netypareo qui se base sur du scrapping en utilisant votre compte.

Login et password sont vos identifiants netypareo.

# Docs pour l'API - requêtes fonctionnelles

## Vue d'ensemble [/overview]

### Récupérer les 5 dernières notes [GET]

  `/overview/last_notes?login?password`

+ Réponse
  
      [
          {
              "matiere": "Expression & communication en anglais",
              "date": "03/11/2022",
              "note": "- / 20",
              "moyenne": "6,03"
          },
          {
              "matiere": "Projets et professionnalisation",
              "date": "19/10/2022",
              "note": "20,00 / 20",
              "moyenne": "12,25"
          },
          {
              "matiere": "Projets et professionnalisation",
              "date": "19/10/2022",
              "note": "20,00 / 20",
              "moyenne": "11,60"
          },
          {
              "matiere": "Administration des systèmes",
              "date": "19/10/2022",
              "note": "19,00 / 20",
              "moyenne": "13,42"
          },
          {
              "matiere": "Projets et professionnalisation",
              "date": "19/10/2022",
              "note": "20,00 / 20",
              "moyenne": "13,55"
          }
      ]

## Récupérer les dernières absences [GET]

  `/overview/last_absences?login?password`

- Réponse
  
  ```
  [
      {
          "type": "En Entreprise justifié",
          "date": "Absence le 03/11/2022"
      },
      {
          "type": "Absence Justifiée",
          "date": "Absence du 15/06/2022 au 16/06/2022"
      },
      {
          "type": "Absence Justifiée",
          "date": "Absence le 04/02/2022"
      }
  ]
  ```
