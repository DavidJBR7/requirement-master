import TrueFalseActivity from "./TrueFalseActivity";
// import MatchPairsActivity from "./MatchPairsActivity";
// import MultipleChoiceActivity from "./MultipleChoiceActivity";
// import ChatbotSimulationActivity from "./ChatbotSimulationActivity";
// import VennDiagramActivity from "./VennDiagramActivity";
// import SwipeCardsActivity from "./SwipeCardsActivity";
// import DragDropColumnsActivity from "./DragDropColumnsActivity";
// import SortableListActivity from "./SortableListActivity";

export default function ActivityFactory({
  activity,
  onSubmitAnswer,
  onActivityComplete,
}) {
  if (!activity) return null;

  const items = activity.configuration?.items || [];
  const answers = activity.answers || [];

  const commonProps = {
    items,
    initialAnswers: answers,
    onSubmitAnswer,
    onActivityComplete,
    activityId: activity.id,
    maxScore: activity.maxScore,
    maxXp: activity.maxXp,
  };

  switch (activity.type) {
    case "TRUE_FALSE":
      return <TrueFalseActivity {...commonProps} />;
    // case "MATCH_PAIRS":
    //   return <MatchPairsActivity {...commonProps} />;
    // case "MULTIPLE_CHOICE":
    //   return <MultipleChoiceActivity {...commonProps} />;
    // case "CHATBOT_SIMULATION":
    //   return <ChatbotSimulationActivity {...commonProps} />;
    // case "VENN_DIAGRAM":
    //   return <VennDiagramActivity {...commonProps} />;
    // case "SWIPE_CARDS":
    //   return <SwipeCardsActivity {...commonProps} />;
    // case "DRAG_DROP_COLUMNS":
    //   return <DragDropColumnsActivity {...commonProps} />;
    // case "SORTABLE_LIST":
    //   return <SortableListActivity {...commonProps} />;
    default:
      return (
        <p className="text-gray-500">Tipo de actividad no soportada aún.</p>
      );
  }
}
