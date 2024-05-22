<<<<<<< HEAD
Statut de l'éva passe a complété et capacité de voir sa note sans la correction accessible encore.

Mettre en places "validationS" dans prgression avec un setValidation (pour les 6emes)

Revoir la notion de reprise d'eva et de date . Remise a zero (null) si je reviens sur une eva hors session.
=======
status a creer
Cmt faire si un eleve fait plusieurs evaluations ? 
S'assurer que lorsque on clique sur commencer l'eva la progression enregistre bien l'évaluation id. 
Retrouver les notes de l'évaluation dans Notes

reregarder cmt est définie une progression vis a vis de la session
--------------------------------
Revoir la notion de reprise d'eva et de date 
>>>>>>> origin/master

La correction doit ensuite prendre le json pour afficher les points a la question, a l'exo et enfin a l'eva.

Est-ce que je garde les points dans les completions ?

faire le monito avec l'affichage des points selon la même structure.

mettre en place le changecompletion et le changeNote sur questionText => a tester desormais

V5 react query.
Dashboard et profil reconverti. Gros menage a faire dans fetch et post qui sapelleront query et mutate 
rename setCOmpletion ?
bien reperer dans les questions ce qui est lu en cache ou pas : stale ou  fetching lors du chagmt dexo 




soumettre certaines question a validation


si le pid n'existe pas dans les completions alors il faut creer une completion

je bloque sur le moyen de creer une completion à l'affichage des questions avec le pid qui ne doit pas changer si je refresh la page !
Les completions ne devrait pas s'ajouter mais se modifier.

rendu aux questiolns a refactoriser

usePArams hooks for all pages


dif entre exo et questions ? pas tres clair sur les query : changer les noms


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

Profile > Dashboard > Evaluation > Exo > Questions 

Il faut bien faire la différence entre progression et completion. 
Une progression est une session avec le nom et les evaluations réalisées ainsi que les completions associées.

Une completion est une relation 1 question et 1/plusieurs réponse id.

Une progression à autant de completions que de questions. Les completions permettent de garder en mémoire les réponses de l'user.

A chaque question répondue, une completion est mise à jour et les points sont remontés vers le parent Exo. 
Ces points sont ensuites renvoyés à Eva qui doit enregistrer et envoyer sous la forme json le recap des points vers progression.

Il doit y avoir une difference entre points note et score. 

De quelle manière une progression appartient à une seule évaluation?
Et si plusieurs eva étaient à faire pour une seule session? New pid ?

{note : 2, exercices : {4 : { 10 : 0, 12 : 2}, 6 : { 11 : 0}}}


setPost({
  ...post,
  postDetails: {
    ...post.postDetails,
    [event.target.name]: event.target.value,
  },
});