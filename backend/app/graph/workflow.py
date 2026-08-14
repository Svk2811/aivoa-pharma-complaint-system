from langgraph.graph import StateGraph, END

from app.graph.state import ComplaintState
from app.graph.nodes import extraction_node, completeness_check_node, risk_and_capa_node


def build_complaint_graph():
    graph = StateGraph(ComplaintState)

    # Add nodes
    graph.add_node("extract", extraction_node)
    graph.add_node("check_completeness", completeness_check_node)
    graph.add_node("risk_capa_assessment", risk_and_capa_node)

    # Define linear execution flow
    graph.set_entry_point("extract")
    graph.add_edge("extract", "check_completeness")
    graph.add_edge("check_completeness", "risk_capa_assessment")
    graph.add_edge("risk_capa_assessment", END)

    return graph.compile()


complaint_workflow = build_complaint_graph()
