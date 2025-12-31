import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_erd():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Entities
    entities = {
        "User": (1, 8),
        "Service": (5, 5),
        "CheckRun": (1, 2),
        "AlertRule": (8, 8),
        "AlertEvent": (8, 2)
    }

    styles = dict(boxstyle="round,pad=0.5", fc="white", ec="black", lw=1.5)

    for name, pos in entities.items():
        ax.text(pos[0], pos[1], name, fontsize=12, fontweight='bold', ha='center', bbox=styles)

    # Relationships
    def draw_edge(p1, p2, label):
        ax.annotate("", xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", lw=1))
        mid = ((p1[0]+p2[0])/2, (p1[1]+p2[1])/2)
        ax.text(mid[0], mid[1], label, fontsize=10, ha='center', backgroundcolor='white')

    draw_edge((1.5, 8), (4.5, 5.5), "1 : N") # User -> Service
    draw_edge((5, 4.5), (1.5, 2.5), "1 : N") # Service -> CheckRun
    draw_edge((5.5, 5.5), (7.5, 7.5), "1 : N") # Service -> AlertRule
    draw_edge((5.5, 4.5), (7.5, 2.5), "1 : N") # Service -> AlertEvent
    draw_edge((8, 7.5), (8, 2.5), "1 : N") # AlertRule -> AlertEvent

    plt.title("Entity Relationship Diagram (ERD)", fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig("erd_diagram.png", dpi=300)
    plt.close()

def draw_c4():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # System Components
    components = [
        {"name": "Web UI\n(Next.js)", "pos": (1, 7), "color": "#e3f2fd"},
        {"name": "API Gateway\n(NestJS)", "pos": (5, 7), "color": "#f3e5f5"},
        {"name": "Internal\nScheduler", "pos": (5, 4), "color": "#fff3e0"},
        {"name": "Database\n(PostgreSQL)", "pos": (9, 7), "color": "#e8f5e9"},
        {"name": "Cache/Queue\n(Redis)", "pos": (9, 4), "color": "#ffebee"}
    ]

    for comp in components:
        rect = patches.Rectangle((comp["pos"][0]-1, comp["pos"][1]-0.7), 2, 1.4, lw=1.5, ec="black", fc=comp["color"], zorder=2)
        ax.add_patch(rect)
        ax.text(comp["pos"][0], comp["pos"][1], comp["name"], fontsize=10, fontweight='bold', ha='center', va='center', zorder=3)

    # Interactions
    def connect(p1, p2, label):
        ax.annotate(label, xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", lw=1), fontsize=8, ha='center')

    connect((2, 7), (4, 7), "HTTP/WS")
    connect((6, 7), (8, 7), "Prisma")
    connect((6, 4.5), (5, 6.3), "Internal")
    connect((6, 4), (8, 4), "Redis Client")
    connect((9, 6.3), (9, 4.7), "")

    plt.title("C4 System Architecture Diagram", fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig("architecture_diagram.png", dpi=300)
    plt.close()

if __name__ == "__main__":
    print("Generating diagrams...")
    draw_erd()
    draw_c4()
    print("Diagrams generated successfully.")
