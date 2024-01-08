
resoudre le probleme de chargement du contenu.Faire un faux loading pour attendre avant d'afficher ? 

Probleme identifié avec "loading QUestion" . 
Il faut peut-etre utiliser suspense ? Il faut s'assurer que l'intégralité des data soient bien chargés afin d'afficher la page.

Il faudrait probabelement refactoriser afin de comprendre plus rapidement l'essentiel des pages . Avoir un dossier avec les sous-components et une seule page pour les use-query ?

Correction et validation à réaliser pour les différents types

La validation du texte devrait pouvoir se faire dans un second temps via le monitoring par ex ? La recherche de mot clefs et la bonne orthographe paraissent pour l'instant complexe à mettre en place. 

Espoir : Avoir une liste des eleves avec leur completion et leur note totale. La note totale doit etre réfléchie en fonction du score total de l'évaluation.

cmt preserver les queries lors d'un url

return to beginning if sessioStorage doesn't exist for next page ?

ajouter bouton reprendre la session (url enregistré à chaque fois?)

Ajouter evaluation status 

reflechir au moyen d'avoir eleve - competence - travail satisfaisant

essayer tt de mm de mettre un etat sur le layout comme   const [progressionId, setProgressionId] = useState(0);

renseigner les PAP

---------------

CHanger affichage dans les relations sur l'admin : Builder > Configure la vue > Edit Progression > Nom de l'entrée : id