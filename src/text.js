import {shuffle} from './helpers';

const text = `In my father I observed mildness of temper, and unchangeable resolution in the things which he had determined after due deliberation; and no vainglory in those things which men call honours; and a love of labour and perseverance; and a readiness to listen to those who had anything to propose for the common weal; and undeviating firmness in giving to every man according to his deserts; and a knowledge derived from experience of the occasions for vigorous action and for remission. And I observed that he had overcome all passion for boys; and he considered himself no more than any other citizen; and he released his friends from all obligation to sup with him or to attend him of necessity when he went abroad, and those who had failed to accompany him, by reason of any urgent circumstances, always found him the same. I observed too his habit of careful inquiry in all matters of deliberation, and his persistency, and that he never stopped his investigation through being satisfied with appearances which first present themselves; and that his disposition was to keep his friends, and not to be soon tired of them, nor yet to be extravagant in his affection; and to be satisfied on all occasions, and cheerful; and to foresee things a long way off, and to provide for the smallest without display; and to check immediately popular applause and all flattery; and to be ever watchful over the things which were necessary for the administration of the empire, and to be a good manager of the expenditure, and patiently to endure the blame which he got for such conduct; and he was neither superstitious with respect to the gods, nor did he court men by gifts or by trying to please them, or by flattering the populace; but he showed sobriety in all things and firmness, and never any mean thoughts or action, nor love of novelty. And the things which conduce in any way to the commodity of life, and of which fortune gives an abundant supply, he used without arrogance and without excusing himself; so that when he had them, he enjoyed them without affectation, and when he had them not, he did not want them. No one could ever say of him that he was either a sophist or a homebred flippant slave or a pedant; but every one acknowledged him to be a man ripe, perfect, above flattery, able to manage his own and other men's affairs. Besides this, he honoured those who were true philosophers, and he did not reproach those who pretended to be philosophers, nor yet was he easily led by them. He was also easy in conversation, and he made himself agreeable without any offensive affectation. He took a reasonable care of his body's health, not as one who was greatly attached to life, nor out of regard to personal appearance, nor yet in a careless way, but so that, through his own attention, he very seldom stood in need of the physician's art or of medicine or external applications. He was most ready to give way without envy to those who possessed any particular faculty, such as that of eloquence or knowledge of the law or of morals, or of anything else; and he gave them his help, that each might enjoy reputation according to his deserts; and he always acted conformably to the institutions of his country, without showing any affectation of doing so. Further, he was not fond of change nor unsteady, but he loved to stay in the same places, and to employ himself about the same things; and after his paroxysms of headache he came immediately fresh and vigorous to his usual occupations. His secrets were not but very few and very rare, and these only about public matters; and he showed prudence and economy in the exhibition of the public spectacles and the construction of public buildings, his donations to the people, and in such things, for he was a man who looked to what ought to be done, not to the reputation which is got by a man's acts. He did not take the bath at unseasonable hours; he was not fond of building houses, nor curious about what he ate, nor about the texture and colour of his clothes, nor about the beauty of his slaves. His dress came from Lorium, his villa on the coast, and from Lanuvium generally. We know how he behaved to the at Tusculum who asked his pardon; and such was all his behaviour. There was in him nothing harsh, nor implacable, nor violent, nor, as one may say, anything carried to the sweating point; but he examined all things severally, as if he had abundance of time, and without confusion, in an orderly way, vigorously and consistently. And that might be applied to him which is recorded of Socrates, that he was able both to abstain from, and to enjoy, those things which many are too weak to abstain from, and cannot enjoy without excess. But to be strong enough both to bear the one and to be sober in the other is the mark of a man who has a perfect and invincible soul, such as he showed in the illness of Maximus.`;
const words = text
  .replace(/[,.;']/g , '').split(' ')
  .map(word => word.toLowerCase())
  .filter(word => word.length > 5);

export default shuffle(words);