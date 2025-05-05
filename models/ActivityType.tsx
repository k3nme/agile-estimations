class ActivityType {
  static readonly ESTIMATION = {
    id: 1,
    name: "Estimation",
    disabled: false,
  };
  static readonly RETROSPECTIVE = {
    id: 2,
    name: "Retrospective (Beta)",
    disabled: true,
  };
  static readonly SPRINT_PLANNING = {
    id: 3,
    name: "Sprint Planning (Beta)",
    disabled: true,
  };
  static readonly SPRINT_REVIEW = {
    id: 5,
    name: "Sprint Review (Beta)",
    disabled: true,
  };

  public static readonly _activityTypes = [
    ActivityType.ESTIMATION,
    ActivityType.RETROSPECTIVE,
    ActivityType.SPRINT_PLANNING,
    ActivityType.SPRINT_REVIEW,
  ];

  private constructor() {}
}

export default {
  ActivityType,
  _activityTypes: ActivityType._activityTypes,
};
